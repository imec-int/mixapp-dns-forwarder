# mixapp-dns-forwarder

Een DNS-forwarder die we kunnen gebruiken op ons 2 jaar MiX event

## Installation

run

    npm install

from the ```app/``` folder

## Configuration

Change the ```DNSentries``` variable in ```app/config.js``` with the local IP you want to use.

## Run

run

    sudo node app.js

from the ```app/``` folder.

**sudo** is needed because a DNS-server always runs on port 53.

## Testing
Enter the IP of this DNS-server into your network settings of your computer/router/smartphone and go to one of the domains you've set up in ```DNSentries``` (under  ```app/config.js```).

Be amazed by al the requests your smartphone makes :p

## Alternatives

* [DNSMasq](http://passingcuriosity.com/2013/dnsmasq-dev-osx/) (draait ook op DD-wrt enzo)


