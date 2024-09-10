const BASE_URL = "https://join-projekt-85028-default-rtdb.europe-west1.firebasedatabase.app/";

const kontakte = [
    { name: "Anna Müller", email: "anna.mueller@example.com", telefonnummer: "123456789" },
    { name: "Max Schneider", email: "max.schneider@example.com", telefonnummer: "987654321" },
    { name: "Lena Fischer", email: "lena.fischer@example.com", telefonnummer: "456789123" },
    { name: "Paul Weber", email: "paul.weber@example.com", telefonnummer: "654123987" },
    { name: "Julia Wagner", email: "julia.wagner@example.com", telefonnummer: "321654987" },
    { name: "Tim Becker", email: "tim.becker@example.com", telefonnummer: "159753258" },
    { name: "Lisa Hoffmann", email: "lisa.hoffmann@example.com", telefonnummer: "753951456" },
    { name: "Tom Schäfer", email: "tom.schaefer@example.com", telefonnummer: "951753654" },
    { name: "Emma Bauer", email: "emma.bauer@example.com", telefonnummer: "357951456" },
    { name: "Jan Richter", email: "jan.richter@example.com", telefonnummer: "159357852" },
    { name: "Lukasz Szymczak", email: "lukas@example.com", telefonnummer: "159357852" }
];

const farben = [
    "#FF7A00", "#FF5EB3", "#6E52FF", "#9327FF", "#00BEE8", 
    "#1FD7C1", "#FFC701", "#0038FF", "#C3FF2B", "#FF4646",
    "#FF745E"
];

// Funktion, um einen Kontakt in Firebase zu erstellen
const erstelleKontakt = async (kontakt, farbe) => {
    const kontaktPfad = encodeURIComponent(kontakt.name); // Verwende den gesamten Namen als Pfad und kodiert ihn für URLs

    const kontaktData = {
        name: kontakt.name,
        email: kontakt.email,
        telefonnummer: kontakt.telefonnummer,
        farbe: farbe
    };

    try {
        const response = await fetch(`${BASE_URL}/kontakte/${kontaktPfad}.json`, {
            method: "PUT",  // Verwendung von PUT, um einen bestimmten Pfad zu erstellen/aktualisieren
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(kontaktData)
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`Kontakt erstellt:`, data);
        } else {
            console.error("Fehler beim Erstellen des Kontakts:", response.status);
        }
    } catch (error) {
        console.error("Fehler:", error);
    }
};

// Alle Kontakte mit Farben in Firebase erstellen
const erstelleKontakteMitFarben = () => {
    kontakte.forEach((kontakt, index) => {
        const farbe = farben[index]; // Jeder Kontakt bekommt eine andere Farbe
        erstelleKontakt(kontakt, farbe);
    });
};

// Funktion aufrufen, um Kontakte zu erstellen

//erstelleKontakteMitFarben();











const deleteKontakt = async (name) => {
    const kontaktPfad = encodeURIComponent(name); // Kodiert den Namen für die URL

    try {
        const response = await fetch(`${BASE_URL}/kontakte/${kontaktPfad}.json`, {
            method: "DELETE" // Verwendet die DELETE-Methode, um den Kontakt zu löschen
        });

        if (response.ok) {
            console.log(`Kontakt ${name} wurde erfolgreich gelöscht.`);
        } else {
            console.error("Fehler beim Löschen des Kontakts:", response.status);
        }
    } catch (error) {
        console.error("Fehler:", error);
    }
};

// Beispiel: deleteKontakt("Anna Müller") würde den Kontakt mit dem Namen "Anna Müller" aus der Firebase-Datenbank löschen.








