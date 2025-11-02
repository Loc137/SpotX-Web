export async function getToken() {
    const clientId = '250e05f88f254739a86700f3880df24e';
    const clientSecret = 'b1a96820222449e2bbf2f15f9ed4e2aa';

    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    const data = await result.json();
    return data.access_token;
}
