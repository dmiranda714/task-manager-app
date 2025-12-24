const  CLIENT_ID = '686636615526-mgrsmkg2vl38tdaeg0tabi6oah001e2h.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBkoK3nkQRyE5ltok-GUsQ7hcT9YdBzxhg';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
let tokenClient;
let gapiInited = false;
let gisInited = false;

function gapiLoaded() {
  console.log("gapi script loaded, now initializing client...");
    gapi.load("client", initializeGapiClient);
}

async function initializeGapiClient() {
    console.log("Initializing gapi client with discovery docs...");
    await gapi.client.init({
        apiKey : API_KEY,
        discoveryDocs: [DISCOVERY_DOC]
    })
}

function gisLoaded() {
    console.log("GIS script loaded, setting up token client...");
    window.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (resp) => {
            if(resp.error) {
                console.error("Token error:", error);
                return;
            }
            console.log("Token received:", resp.access_token);
            gapi.client.setToken({access_token: resp.access_token});
            localStorage.setItem("google_access_token", resp.access_token);
            if(window.ngAuthService) {
                window.ngAuthService.setSignedIn(true);
            }
        }
    })
    gisInited = true;
    console.log("GIS token client initialized")
}