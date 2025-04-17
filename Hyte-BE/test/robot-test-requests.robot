*** Settings ***
Library    RequestsLibrary
Library    Collections
Suite Setup    Authenticate as Admin         # Suoritetaan ennen testitapauksia

*** Keywords ***
Authenticate as Admin
    [Documentation]  Kirjaudutaan sisään ylläpitäjän oikeuksilla.
    ...              - Aluksi luodaan rakenne (Dictionary), joka sisältää käyttäjänimen ja salasanan
    ...              - body-rakenne annetaan POST metodille JSON-parametrina
    ...              - Palautteena tuleva JSON-rakenne tulostetaan lokitiedostoon
    ...              - JSON rakenteesta kaivetaan esiin token
    ...              - Token tulostetaan myös lokitiedostoon
    ...              - Lopuksi token tallennetaa testijoukon muuttujiin muita kutsuja varten
    ${body}    Create Dictionary    username=meiadmin    password=salasana
    ${response}    POST    url=http://localhost:3000/api/auth/login    json=${body}
    Log    ${response.json()}
    ${token}    Set Variable    ${response.json()}[token]
    Log    ${token}
    Set Suite Variable    ${token}

*** Test Cases ***
Get User Info
    ${header}    Create Dictionary    Authorization=Bearer ${token}
    ${response}    Get    url=http://localhost:3000/api/auth/me    headers=${header}
    Log    ${response.json()}
    Status Should Be    200    ${response}
    Should Be Equal As Numbers    ${response.json()}[user_id]    33

Post A New Entry
    ${header}    Create Dictionary    Authorization=Bearer ${token}
    ${body}    Create Dictionary    entry_date=2025-04-16    mood=iloinen    weight=60    sleep_hours=6    notes=iloinenjee
    Log    ${body}
    ${response}    Post    url=http://localhost:3000/api/entries    headers=${header}    json=${body}
    Log    ${response.json()}
    Status Should Be    201    ${response}

Get Users Entries
    ${header}    Create Dictionary    Authorization=Bearer ${token}
    ${response}    Get    url=http://localhost:3000/api/entries    headers=${header}
    ${entries_id}    Create List
    FOR    ${entry}    IN    @{response.json()}
        ${entry_id}    Set Variable    ${entry}[entry_id]
        Append To List    ${entries_id}    ${entry_id}
    END
    Log    ${response.json()}
    Log    ${entries_id}
    Set Suite Variable    ${entries_id}
    Status Should Be    200    ${response}

Edit The New Entry
    ${header}    Create Dictionary    Authorization=Bearer ${token}
    ${body}    Create Dictionary    entry_date=2025-04-16    mood=hyvä    weight=60    sleep_hours=6    notes=iloinenjee
    Log    ${body}
    ${entry_id}    Get From List    ${entries_id}    -1
    ${response}    Put    url=http://localhost:3000/api/entries/${entry_id}    headers=${header}    json=${body}
    Log    ${response.json()}
    Status Should Be    200    ${response}
    Should Contain    ${response.json()}[message]    true

Delete An Entry
    ${header}    Create Dictionary    Authorization=Bearer ${token}
    ${entry_id}    Get From List    ${entries_id}    -1
    ${response}    Delete    url=http://localhost:3000/api/entries/${entry_id}    headers=${header}
    Log    ${response.json()}
    Status Should Be    200    ${response}

Create A New User
    ${body}    Create Dictionary    username=robot    password=robot_salasana    email=robot@testitili.robot
    Log    ${body}
    ${response}    Post    url=http://localhost:3000/api/users    json=${body}
    Log    ${response.json()}
    Status Should Be    201    ${response}

Get All Users
    ${header}    Create Dictionary    Authorization=Bearer ${token}
    ${response}    Get    url=http://localhost:3000/api/users    headers=${header}
    Log    ${response.json()}
    Status Should Be    200    ${response}
    ${users_id}    Create List
    FOR    ${user}    IN    @{response.json()}
        ${user_id}    Set Variable    ${user}[user_id]
        Append To List    ${users_id}    ${user_id}
    END
    Log    ${users_id}
    Set Suite Variable    ${users_id}

Edit The New User
    ${body}    Create Dictionary    username=robot    password=robot_salasana_uusi    email=robot@testitili.robot
    Log    ${body}
    ${response}    Put    url=http://localhost:3000/api/users    json=${body}
    Log    ${response.json()}
    Status Should Be    201    ${response}
    Should Contain    ${response.json()}[message]    true


Delete An User By User ID
    ${header}    Create Dictionary    Authorization=Bearer ${token}
    ${created_user_id}    Get From List   ${users_id}    -1
    ${response}    Delete    url=http://localhost:3000/api/users/${created_user_id}    headers=${header}
    Log    ${response.json()}
    Status Should Be    200    ${response}
    Should Contain    ${response.json()}[message]    true




Get Bookings from Restful Booker
    [Documentation]   Lukee kaikki varaukset palvelimelta.
    ...               Koska *Authenticate as Admin* on määritetty asetuksissa Suite Setup -parametriksi,
    ...               suoritetaan se ennen testitapauksia. Jos kirjautuminen on onnistunut, ei kirjautumista
    ...               tarvitse suorittaa erikseen jokaisessa testitapauksessa. Tässä testitapauksessa jatketaan
    ...               seuraavaksi varausten lukemista palvelimelta. Jos luku onnistuu response.status == 200 ja
    ...               testi yritää lukea jokaisen varauksen tiedot erikseen käyttäen FOR-silmukkaa.
    ${body}    Create Dictionary    firstname=John
    ${response}    GET    https://restful-booker.herokuapp.com/booking    ${body}
    Status Should Be    200
    Log List    ${response.json()}
    FOR  ${booking}  IN  @{response.json()}
        ${response}    GET    https://restful-booker.herokuapp.com/booking/${booking}[bookingid]
        TRY
            Log    ${response.json()}
        EXCEPT
            Log    Cannot retrieve JSON due to invalid data
        END
    END

Create a Booking at Restful Booker
    [Documentation]    Luodaan uusi varaus palvelimelle.
    ...                Testi luo uuden varauksen palvelimelle ja tämän jälkeen testaa, että varaus löytyy
    ...                järjestelmästä.
    # Luo uusi varaus
    ${booking_dates}    Create Dictionary    checkin=2024-01-01    checkout=2024-04-11
    ${body}    Create Dictionary    firstname=Hannu    lastname=Kuoppanen    totalprice=205    depositpaid=false    bookingdates=${booking_dates}
    ${response}    POST    url=https://restful-booker.herokuapp.com/booking    json=${body}

    # Hae palautteesta varauksen uusi ID
    ${id}    Set Variable    ${response.json()}[bookingid]
    Set Suite Variable    ${id}

    # Hae palvelimelta varaus ID:n perusteella
    ${response}    GET    https://restful-booker.herokuapp.com/booking/${id}
    Log    ${response.json()}

    # Tarkista, että varaus on kunnossa
    Should Be Equal    ${response.json()}[lastname]    Kuoppanen
    Should Be Equal    ${response.json()}[firstname]    Hannu
    Should Be Equal As Numbers    ${response.json()}[totalprice]    205
    Dictionary Should Contain Value     ${response.json()}    Kuoppanen

Delete Booking
    [Documentation]    Poista varaus palvelimelta.
    ${header}    Create Dictionary    Cookie=token\=${token}
    ${response}    DELETE    url=https://restful-booker.herokuapp.com/booking/${id}    headers=${header}
    Status Should Be    201    ${response}
