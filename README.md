This is a personal project built on Next.js which I primarily used for learning and getting better with React and Next.js

The goal of this project is to create a web application which

This project is still WIP

## Implemented functionalities

- [x] Login using nextauth
- [x] Ability to create exercise
  - [x] Title
  - [x] Description
  - [x] Example image / video (Youtube)
- [x] Ability to create workout
  - [x] add arbitrary number of exercises
  - [x] add arbitrary number of laps
  - [x] set exercises either for time or repetitons
  - [x] set number or repetitions or amount of time
- [x] Ability to browse all workouts and exercises
- [x] Ability to "play" selected workout
- [x] Ability to edit / delete exercise (for admin user)
- [x] Ability to edit / delete workout (for admin user)
- [x] Working timer on Work Out page
- [x] Ability to make workout accessible only to certain users

## TODO

- [ ] Add option to create private workout
- [ ] Add option to share private workout via direct link
- [ ] Add option to edit workout for user who created it
- [ ] Add option to edit exercise for user who created it
- [ ] Add error handling on create workout / exercise pages

* [ ] Write tests

## Images

<p align="center">
  <img src="./images/exercises.png" alt="Desktop version" width="100%">
  <img src="./images/workout.png" alt="Desktop version" width="100%">
  <img src="./images/exercise.png" alt="Desktop version" width="100%">
</p>
<p>
  <img src="./images/work-out-reps.png" alt="Desktop version" width="49.5%">
  <img src="./images/work-out-time.png" alt="Desktop version" width="49.5%">
</p>

Illustrations used in example images are created by [Lio putra](https://www.shutterstock.com/g/Lioputra)

## Technologies Used

- Next.js
- Typescript
- React @16.13.0
- Prisma @4.0.0
- nextauth @1.0.3
- usehooks-ts @2.9.1
- Tailwind CSS
- Tailwind-elements

## Getting Started

First, run the development server:

1. Clone the repository `git clone git@github.com:xkosorin/workout-timer-nextjs.git`
   - If you are using npm delete `yarn.lock` file
2. Run `yarn install` or `npm install`
3. Rename `.env.example` to `.env`
   - Run `mv .env.example .env` to rename the file
4. Fill in fields in `.env` file
   - For `DATABASE_URL` the default value is `postgresql://admin:passwd@localhost:5432/db`
     - If you want to change default values you have to modify `docker-compose.yaml` file
   - For `GITHUB_ID` and `GITHUB_SECRET` you have go to [Github Developer Settings](https://github.com/settings/developers)
     - Click on `New OAuth App`
     - For `Homepage URL` use `http://localhost:3000/`
     - For `Authorization callback URL` use `http://localhost:3000/api/auth`
     - Click on `Generate a new client secret`
   - For `EMAIL_FROM` you can specify any valid form of email address
   - For `EMAIL_SERVER` you have to specify a SMTP address (example: `smtp://username:password@smtp.example.com:587`)
5. Run the application by `yarn dev` or `npm run dev`
6. Run the database using Docker by `docker-compose up`
   - Optionally you can run `npx prisma db seed` to prepopulate some example exercises

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
