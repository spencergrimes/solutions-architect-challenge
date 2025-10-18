# Carton Caps Referral API Design

## Project Overview

The full spec for this API is documented in [docs/specifications.yaml](./docs/specifications.yaml). This README discusses the design decisions and then Quickstart and Usage Examples for the included mocked endpoint. 

### Original Prompt
Carton Caps is an app that empowers consumers to raise money for the schools they care about, while buying the everyday products they love. In this hypothetical example, the app is already full-featured and publicly available. 

There is a third-party vendor for deferred deep link support. Addditionally we'll assume there's an existing API that includes:
 - User authentication.
 - User profile details that include the current user's referral code.
 - New user registration.
 - Referral redemption as part of new user registration.

### Additional Project Assumptions
>*These are assumptions I made when designing this API*

#### Backend team has full ownership over the existing API services 
It is assumed that the backend team is able to make updates to the existing new user registration process, as well as adding additional endpoints for the new functionality. 

The spec will also provide a recommendation if the existing user registration process is managed by some external party/team and the team is unable to make updates.

#### The provided UI design guide is not definitive of backend design
It is assumed that the design UI guide includes the suggested UI/UX experience, but not deterministic of the minutia of the backend design. For example, in the "Invite Friends: Share" flow, the example construction of the share URL with the referral code in the query parameters is indicative that the referral code should be contained within the link from a UI/UX perspective, but not a backend design requirement. It is assumed that the backend team has full authority to implement the share link in the most appropriate and secure method. 

If the backend team is required to include a referral_code parameter in the share URL because of a UI/UX design decision, the `/referral/{referralCode}/link` endpoint will need to be updated to include the query param.

#### The deep link provider chosen for this project includes tracking functionality
It is assumed that the deep link provider is something like Branch, AppsFlyer or a custom provider that is able to capture and track additional metadata parameters such as channel and utm parameters. If still evaluating providers, it would be additionally helpful to be able to capture custom metadata parameters like user_id, referral_code, location data, etc, but that is not assumed. 

### Future Extendability
While it would be simplier from a database and API design perspective to make a user and their referral code a one-to-one relationship and assume referral code by the user authentication. However, by treating the referral code as it's own identifier, future extensions of this application will be much simplier. Future features like enabling special promotion campaigns in which users are rewarded for sharing the app as a part of a specific campaign/event, or a group referral code feature in which multiple users can work together to get rewarded for their combined efforts, would be unnecessarily difficult and backwards compatibility more challenging if this API simply built all referral endpoints with respect to the users.

Additionally it is assumed for simplicity that the only users that will be accessing their referral list and status data will be the relevant users themselves. However it is likely in a real-life environment that an internal admin, business owner, or app manager would also be able to see other user's lists in some kind of dashboard feature. This API design (using `userId` as a path param in the `/user/{userId}/referrals/list` endpoint) allows for future development of such a feature, simply by adjusting the security model and reusing the existing API.

Finally, recent changes in the privacy protections of Apple and Android make the recommended promotion abuse mitigation recommended in this project potentially brittle (if iOS or Android deprecate unique device identifiers). Collecting phone number in the user registration maybe an effective alternative that mitigates abuse event outside of changes to the iOS or Android privacy ecosystem. 

### Data access model
* For simplicity it is assumed that only referring users themsevles will require acccess to their referral status. See the Future Exendability section for more. 
* Users should only have access to create share links for their own referral code. See "Future Extendability" section for how this could be changed in the future. 

## Getting Started

### Prerequisites

This project will require installation of a few packages. Before running the application, you will need:
* npm - https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

This project has a small number of standard framework library dependancies:
* express - standard javascript router library
* express-rate-limit - standard express rate limiting library
* better-sqlite3 - simple database library for SQLite3 with typescript

There are a few dev dependancies specifically for type safety and testing
* typescript - type safety for javascript
* jest - testing tool
* supertest - standard jest tool for testing express endpoints
* babel-jest - enables jest to run with TS

### Quickstart

```bash 
#Install project dependancies
npm install

#Seed the mock database
npm run seed

#Build the server
npm run build

#Start the server
npm start

#Run tests with coverage analysis
npm run test -- --coverage
```

## Usage Instructions
If you have seeded the DB with the package script, and are running the server, you can use these examples on live mock data from the server
```bash
curl -X POST "http://localhost:3000/api/v1/referral/ABC123/link" \
    -H "Authorization: Bearer test-token-123" \
    -H "Content-Type: application/json"
```
Running this POST request multiple times will only create a single share link (for the default channel "other"). To create additional share links, add the channel parameter: 
```bash
curl -X POST "http://localhost:3000/api/v1/referral/ABC123/link?channel=sms" \
    -H "Authorization: Bearer test-token-123" \
    -H "Content-Type: application/json"
```
This way, a user could create up to three unqiue share links (one for each channel) that would display as "pending" with no user yet in their "My Referrals" list (see step 3 of Invite Friends flow in UI Spec). Once a referral is "completed" by a referred user, a new link can be created for that channel, tracked as another "pending" share.
