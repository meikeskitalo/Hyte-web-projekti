# Testaus – Viikkotehtävät


## Viikko 1

### Asennukset

Seuraavat kirjastot on asennettu viikkotehtävien 1 
[asennusohjeiden](https://github.com/sakluk/projekti-terveyssovelluksen-kehitys/blob/main/ohjeet_testaus/01_asennukset.md) mukaisesti:

- Robot Framework  
- Browser Library  
- Requests Library  
- CryptoLibrary  
- Robotidy  

### Asennuksen varmistus

Asennuksen jälkeen suoritettiin `asennustesti.py`, joka varmisti pakettien onnistuneen asennuksen.

## Viikko 2

### Tehtävät

Tehtävät 2, 3 ja 4 tehty.

#### Tehtävä 2

Testikirjautuminen terveyspäiväkirjaan Robot Browser -frameworkilla.

- [Robot-testitiedosto](frontend/teht2/teht2_omabrowser_demo.robot)
- [Robot keywords -tiedosto](frontend/teht2/teht2_omakeywords.robot)

##### Testien tulokset:

- [Raportti](frontend/outputs/teht2_output/report.html)
- [Lokitiedosto](frontend/outputs/teht2_output/log.html)

#### Tehtävä 3

Web-form -[testisivun](https://www.selenium.dev/selenium/web/web-form.html) eri kenttien muokkausta Robot Browser -frameworkilla

- [Robot-testitiedosto](frontend/teht3/teht3_browser_demo.robot)
- [Robot keywords -tiedosto](frontend/teht3/teht3_Keywords.robot)

##### Testien tulokset:

- [Raportti](frontend/outputs/teht3_output/report.html)
- [Lokitiedosto](frontend/outputs/teht3_output/log.html)

#### Tehtävä 4

Uuden päiväkirjamerkinnän lisäys terveyspäiväkirjaan Robot Browser -frameworkilla

- [Robot-testitiedosto](frontend/teht4/teht4_omabrowser_demo.robot)
- [Robot keywords -tiedosto](frontend/teht4/teht4_omakeywords.robot)

##### Testien tulokset:

- [Raportti](frontend/outputs/teht4_output/report.html)
- [Lokitiedosto](frontend/outputs/teht4_output/log.html)

## Viikko 3

### Tehtävät

Tehtävät 5 ja 6 tehty.

#### Tehtävä 5

Tehty kirjautumistesti terveyspäiväkirjasovellukselle, joka käyttää .env-tiedostoon piilotettuja
käyttäjätunnusta ja salasanaa.

- [Robot-testitiedosto](frontend/teht5/teht5_omabrowser_demo.robot)
- [load_env.py-tiedosto](frontend/teht5/load_env.py)

##### Testien tulokset:

- [Raportti](frontend/outputs/teht5_output/report.html)
- [Lokitiedosto](frontend/outputs/teht5_output/log.html)

#### Tehtävä 6

Lisätty kirjautumistestiin salasanan ja käyttäjätunnuksen kryptaus käyttäen CryptoLibrarya.

- [Robot-testitiedosto](frontend/teht6/teht6_omabrowser_demo.robot)

##### Testien tulokset:

- [Raportti](frontend/outputs/teht6_output/report.html)
- [Lokitiedosto](frontend/outputs/teht6_output/log.html)

## Viikko 4

### Tehtävät

Tehtävät 7 ja 8 tehty.

#### Tehtävä 7

Muokattu rakennetta niin, että tulosteet menevät outputs-kansiossa omiin "teht"-kansioihin.

#### Tehtävä 8

Tehty github.io sivu osoitteeseen: [https://meikeskitalo.github.io/Hyte-web-projekti/Hyte-FE/tests/](https://meikeskitalo.github.io/Hyte-web-projekti/Hyte-FE/tests/)

## Viikko 5

#### Tehtävä 9

Tehty testit, joilla testataan taustapalvelimen toimintaa.

- [Robot-testitiedosto](../../Hyte-BE/test/robot-test-requests.robot)

##### Testien tulokset:

- [Raportti](../../Hyte-BE/test/output/report.html)
- [Lokitiedosto](../../Hyte-BE/test/output/log.html)

#### Tehtävä 10

Kaikki tehtävät dokumentoitu päiväkirjasovelluksen GitHub-kansioon käyttäen Markdown-tiedostoja.
