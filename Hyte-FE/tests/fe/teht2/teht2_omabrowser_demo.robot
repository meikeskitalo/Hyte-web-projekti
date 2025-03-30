*** Settings ***
Library     Browser    auto_closing_level=KEEP
Resource    teht2_omakeywords.robot

*** Test Cases ***
Test Web Form
    New Browser    chromium    headless=No  
    New Page       http://localhost:5173/
    Get Title      ==    Terveyspäiväkirja  
    Type Text      [name="username"]        ${Username}    delay=0.1 s 
    Type Secret    [name="password"]    $Password      delay=0.1 s
    Click With Options    [name="submit"]     delay=1 s
    Get Text       id=latest-entries    ==    Päiväkirjamerkinnät