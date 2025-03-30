*** Settings ***
Library     Browser    auto_closing_level=KEEP
Resource    teht4_omakeywords.robot

*** Test Cases ***
Test Web Form
    New Browser    chromium    headless=No  
    New Page       http://localhost:5173/
    Get Title      ==    Terveyspäiväkirja  
    Type Text      [name="username"]        ${Username}    delay=0.1 s 
    Type Secret    [name="password"]    $Password      delay=0.1 s
    Click With Options    [name="submit"]     delay=1 s
    Get Text       id=latest-entries    ==    Päiväkirjamerkinnät
    Click with Options    id=add-button
    Type Text      [name="date"]        ${Päivämäärä}    delay=0.1 s 
    Type Text      [name="mood"]        ${Olotila}    delay=0.1 s 
    Type Text      [name="weight"]        ${Paino}    delay=0.1 s 
    Type Text      [name="sleep_hours"]        ${Unta}    delay=0.1 s 
    Type Text      [name="notes"]        ${Kuvaus}    delay=0.1 s 
    Click with Options    id=diary-submit

