import { Selector, t, ClientFunction } from 'testcafe';

//Tests d'affichage et des boutons

fixture`Page d'accueil`
    .page`http://localhost:8080/esieaFront/#`;

// défini les différents affichages possibles
const screenModes = [
    { width: 320, height: 568 },  // Mobile portrait
    { width: 768, height: 1024 }, // Tablet portrait
    { width: 1024, height: 768 }, // Tablet landscape
    { width: 1920, height: 1080 }, // Desktop
];

for (const mode of screenModes) {

    //Test l'affichage du logo
    test(`Le logo est affiché - ${mode.width}x${mode.height}`, async (t) => {
        await t.resizeWindow(mode.width, mode.height);
        const logo = Selector('h1#logo img');
        await t.expect(logo.visible).ok();
    });

    // Test la présence du champ de recherche
    test(`Le champ de recherche est entièrement visible - ${mode.width}x${mode.height}`, async () => {
        await t.resizeWindow(mode.width, mode.height);
        const searchInput = Selector('#saisieRecherche');
        const searchInputDimensions = await searchInput.boundingClientRect;
        const browserWindowDimensions = await t.eval(() => ({
            width: window.innerWidth,
            height: window.innerHeight
        }));

        // Vérifier si le champ de recherche est entièrement visible
        await t
            .expect(searchInputDimensions.left).gte(0)
            .expect(searchInputDimensions.right).lte(browserWindowDimensions.width)
            .expect(searchInputDimensions.top).gte(0)
            .expect(searchInputDimensions.bottom).lte(browserWindowDimensions.height);
    });

    //Test l'affichage de la liste de voitures
    test(`La liste de voitures est affichée - ${mode.width}x${mode.height}`, async (t) => {
        await t.resizeWindow(mode.width, mode.height);
        const carList = Selector('#listeVoiture');
        await t.expect(carList.visible).ok();
        await t.expect(carList.textContent).notEql('');
    });

    // Test la présence du lien pour ajouter une voiture
    test(`Le lien 'Ajouter une voiture' est présent - ${mode.width}x${mode.height}`, async (t) => {
        await t.resizeWindow(mode.width, mode.height);
        const linkText = Selector('a').withText('Ajouter une voiture');
        await t.expect(linkText.visible).ok();
    });


    //tests boutons

    // Test pour clicker le bouton suivant
    test(`bouton Next - ${mode.width}x${mode.height}`, async t => {
        await t.resizeWindow(mode.width, mode.height);

        const linkText = Selector('a').withText('Next Page');
        await t
            .click(linkText)
            .expect(linkText.textContent).contains('Next Page');
    });

    // Test pour clicker le bouton précédent
    test(`Bouton Previous - ${mode.width}x${mode.height}`, async t => {
        await t.resizeWindow(mode.width, mode.height);

        const linkText = Selector('a').withText('Previous Page');

        await t
            .click(linkText)
            .expect(linkText.textContent).contains('Previous Page');
    });

    // Test pour clicker sur ajouter une voiture
     test('Clicking on "Ajouter une voiture" opens the form', async t => {
        const ajouterVoitureLink = Selector('li').withText('Ajouter une voiture');

        const isAfficherFormulaireCreationCalled = ClientFunction(() => {
        return typeof afficherFormulaireCreation === 'function';
        });
        await t.click(ajouterVoitureLink);

        const isFunctionCalled = await isAfficherFormulaireCreationCalled();
        await t.expect(isFunctionCalled).ok();
    });
}

