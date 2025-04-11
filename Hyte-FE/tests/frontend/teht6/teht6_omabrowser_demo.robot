*** Settings ***
Library     Browser    auto_closing_level=KEEP
Library     CryptoLibrary     variable_decryption=True   #Kryptatut muuttujat puretaan automaattisesti

*** Variables ***
${Username}    crypt:2PK3aihXwppyHyrTV/LAcUhPrxK5bHNDPKq4np1ZNCMMwR74csY9v4asM/3xpbf6eGA/fZoqs8s=
${Password}    crypt:6qdSOd7Ld9wMmZh5UzOPxjGbVIa9BhTjTqvqE7U+iBPuI5Y+R+WsDiFWVXtno0vw8nhToNxG+sM=

*** Test Cases ***
Test Web Form
    New Browser    chromium    headless=No  
    New Page       http://localhost:5173/
    Get Title      ==    Terveyspäiväkirja  
    Type Text      [name="username"]        ${Username}    delay=0.1 s 
    Type Secret    [name="password"]    $Password      delay=0.1 s
    Click With Options    [name="submit"]     delay=1 s
    Get Text       id=latest-entries    ==    Päiväkirjamerkinnät