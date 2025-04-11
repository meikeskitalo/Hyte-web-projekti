*** Settings ***
Library     Browser    auto_closing_level=KEEP
Resource    teht3_Keywords.robot  

*** Test Cases ***
Test Web Form
    New Browser    chromium    headless=No  
    New Page       https://www.selenium.dev/selenium/web/web-form.html 
    Get Title      ==    Web form  
    Type Text      [name="my-text"]        ${Username}    
    Type Secret    [name="my-password"]    $Password      
    Type Text      [name="my-textarea"]    ${Message}    
    Select Options By    css=select.form-select    value    1
    TypeText    input[name="my-datalist"]    ${City}  
    Uncheck Checkbox    selector=#my-check-1    
    Check Checkbox    selector=#my-check-2
    Upload File By Selector    input[type="file"]    ${CURDIR}/${Filename}
    Click With Options    input#my-radio-2
    Click With Options    button    delay=2 s
    Get Text       id=message    ==    Received!