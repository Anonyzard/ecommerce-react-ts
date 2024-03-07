#!/bin/sh
URL=http://127.0.0.1:5000
json_header='Content-Type: application/json'
bearer_header='Authorization: Bearer'
firstname="anonyzard"
lastname=""
password="1234567890"
phone="1234567890"
email="anonyzard@loc-os.com"
echo register
curl -X POST $URL/register --header "$json_header"\
     -d "{\"firstname\": \"$firstname\",
        \"lastname\": \"$lastname\",
        \"password\": \"$password\",
        \"phone\": \"$phone\",
        \"email\": \"$email\"}"
echo login
email="anonyzard@disroot.org"
password="toor"
login_response=$(curl -X POST $URL/login --header "$json_header"\
    -d "{\"email\": \"$email\",
        \"password\": \"$password\"}" 2> /dev/null)
access_token=$(echo "$login_response" | jq -r .access_token)
# refresh_token=$(echo "$login_response" | jq -r .refresh_token)

echo put chair 
curl -sX POST $URL/item --header "$json_header" --header "$bearer_header $access_token" -d "{
	\"name\": \"Mesa\",
    \"image\": \"https://images.unsplash.com/photo-1573104049264-5324ea0027d5?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D\",
    \"description\": \"Mesa pequeña\",
	\"price\": 79.99
}" > /dev/null

curl -sX POST $URL/item --header "$json_header" --header "$bearer_header $access_token" -d "{
	\"name\": \"Torta\",
    \"image\": \"https://images.unsplash.com/photo-1605807646983-377bc5a76493?q=80&w=1924&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D\",
    \"description\": \"Torta selva negra\",
	\"price\": 38.45
}" > /dev/null

curl -sX POST $URL/item --header "$json_header" --header "$bearer_header $access_token" -d "{
	\"name\": \"Manzana\",
    \"image\": \"https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D\",
    \"description\": \"Manzana roja\",
	\"price\": 16.39
}" > /dev/null

curl -sX POST $URL/item --header "$json_header" --header "$bearer_header $access_token" -d "{
	\"name\": \"Auriculares\",
    \"image\": \"https://images.unsplash.com/photo-1505740106531-4243f3831c78?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D\",
    \"description\": \"Auriculares bluetooth\",
	\"price\": 99.00
}" > /dev/null

curl -s $URL/item | jq .

curl -X POST $URL/buy/2 --header "$json_header" --header "$bearer_header $access_token" -d '{"user": 1}'

echo "As ADMIN"
curl $URL/buy --header "$bearer_header $access_token" | jq .