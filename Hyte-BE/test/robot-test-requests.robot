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
    ${header}    Create Dictionary    Authorization=Bearer ${token}
    ${created_user_id}    Get From List   ${users_id}    -1
    ${body}    Create Dictionary    username=robot    password=robot_salasana_uusi    email=robot@testitili.robot
    Log    ${body}
    ${response}    Put    url=http://localhost:3000/api/users/${created_user_id}    json=${body}    headers=${header}
    Log    ${response.json()}
    Status Should Be    200    ${response}
    Should Contain    ${response.json()}[message]    true


Delete An User By User ID
    ${header}    Create Dictionary    Authorization=Bearer ${token}
    ${created_user_id}    Get From List   ${users_id}    -1
    ${response}    Delete    url=http://localhost:3000/api/users/${created_user_id}    headers=${header}
    Log    ${response.json()}
    Status Should Be    200    ${response}
    Should Contain    ${response.json()}[message]    true
