# NextTravel

<div align="center">

[![GitHub Release](https://img.shields.io/badge/Version-Private%20Beta-g)](https://github.com/NextTravelApp/NextTravel/releases/latest)

</div>

## What is NextTravel

NextTravel puts a personal travel assistant directly in your pocket. The app let users create a full trip plan including accomodations, attractions and things to do using an LLM algorithm.

> 👀 [Click for a showcase video](https://youtu.be/vZJdWPhb5aQ)

## Download

The app is currently in Private Beta and not available for download.

## Deploying

You'll have to set a bunch of environment variables to get the app running. You can find the list of environment variables in the [.env.example](.env.example) file.

> ✨ You can generate secret tokens by visiting [this link](https://generate-secret.vercel.app/32)

### Backend

If you want to selfhost the API, you can use Docker. You can build and run the image by running the following command:

```bash
# Build the image
docker build -t nexttravel-api -f api/Dockerfile .
# Run the image on port 3000 with the environment variables from .env
docker run -d -p 3000:3000 --env-file .env nexttravel-api
```

The API will usually be available at `http://localhost:3000/`.

### Frontend

The frontend uses React Native with Expo. You can use EAS to build the app for iOS and Android.

```bash
# Install the EAS CLI
npm install -g eas-cli
# Build the app
eas build
```

---

<p align="center">🏝️ NextTravel &copy; 2024 by <a href="https://github.com/orgs/NextTravelApp/teams/core/members">NextTravel Team</a></p>
