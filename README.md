# Werftour Studio

Gratis app om zelf virtuele werfbezoeken te maken voor het bouwkundig onderwijs. Alles werkt in de browser, op pc, gsm en de Meta Quest.

**Open de app:** https://ind-ing-bouwkunde-vr.github.io/Werftour/

## Drie modi

| Modus | Wat je maakt |
|---|---|
| **360°-rondleiding** | Eigen 360°-foto's (Insta360 Studio, JPG 2:1) met icoontjes en een begeleide rondleiding met gesproken uitleg. |
| **360°-video** | Een begeleid werf- of bedrijfsbezoek op video (mp4, H.264). Icoontjes verschijnen op een gekozen tijdstip; vragen pauzeren de video. |
| **BIM-model** | Een IFC-export uit Revit (IFC 2x3 of IFC4) om op ware schaal in rond te lopen. Klik op bouwdelen voor de BIM-gegevens. |

Soorten icoontjes: info (tekst, foto of plan), vraag (meerkeuze), ga naar (ander standpunt), audio, video, document (PDF) en website.

## Gebruik

1. Open de app en kies op het startscherm een modus: **Nieuw…** of **Demo bekijken**.
2. Voeg je foto's, video's of IFC-bestand toe (kiezen of slepen).
3. Klik in het beeld om een icoontje te plaatsen en vul de tekst in.
4. Klik op **Exporteren**:
   - rondleiding en BIM-model: één `.html`-bestand;
   - 360°-video: een `.zip` met `index.html` en de map `videos`.
5. Het geëxporteerde bestand is tegelijk de viewer voor studenten en je back-up. Verder bewerken kan via **Bestand openen…** op het startscherm.

Je projecten worden automatisch in je eigen browser bewaard (IndexedDB). Er gaat niets naar een server. Exporteer daarom regelmatig.

## Op de Meta Quest: tour versturen met een QR-code

De laptop is de werkplek, de Quest is alleen de viewer. Op de Quest kan je niets bewerken.

**Eenmalig op de Quest:** open in de browser van de Quest
**https://ind-ing-bouwkunde-vr.github.io/Werftour/?quest** en zet die pagina bij je bladwijzers
(of installeer hem als app via het browsermenu).

**Elke keer:**

1. Open je tour op de laptop en klik bovenaan op **Naar Quest**. Je ziet een QR-code en een code van 6 tekens (bv. `K7P 3QX`).
2. Op de Quest: scan de QR-code met de camera van de bril, of open de bladwijzer en typ de code.
3. De tour komt rechtstreeks van de laptop naar de bril (niet via een server) en wordt op de bril bewaard.
4. Tik op **▶ Start in VR** of **Start in VR met rondleiding**.

Daarna heb je de laptop niet meer nodig: de tour blijft onder *Op deze bril* staan, ook zonder internet.
Meerdere brillen tegelijk kan: laat het venster op de laptop open tot elke bril *klaar ✓* toont.
Heb je de tour aangepast? Stuur hem gewoon opnieuw, de oude versie op de bril wordt vervangen.

**Lukt de verbinding niet?** De laptop en de Quest moeten elkaar kunnen bereiken. Sommige netwerken
(zoals eduroam) blokkeren dat. Zet dan de laptop en de Quest op de hotspot van een gsm. Als alternatief
kan je de tour exporteren en openen via de [VR-viewer starter](https://github.com/ind-ing-bouwkunde-vr/vr-viewer).

**In VR:** richt de straal en druk op de trigger. In een BIM-model stap je met de linker stick en draai
je met de rechter stick (in stappen van 30°, tegen misselijkheid).

## Tips voor bestanden

- **360°-foto's:** exporteer in Insta360 Studio als 360°-foto (JPG, 2:1). Grote foto's worden automatisch verkleind tot 6144 px breed.
- **360°-video:** exporteer als mp4 met **H.264** (niet H.265), bij voorkeur 3840 × 1920. Splits lange bezoeken in delen.
- **IFC:** exporteer in Revit via *Bestand › Exporteren › IFC* (IFC 2x3 Coordination View of IFC4 Reference View).

## Bronnen en licenties

- 3D-weergave: [three.js](https://threejs.org) (MIT), [three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh) (MIT)
- IFC-lezer: [web-ifc](https://github.com/ThatOpen/engine_web-ifc) (MPL-2.0)
- Zip: [JSZip](https://stuk.github.io/jszip/) (MIT)
- Versturen naar de Quest: [PeerJS](https://peerjs.com) (MIT, WebRTC; de gratis PeerJS-server legt alleen de verbinding, de tour zelf gaat rechtstreeks), [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) (MIT)
- Demobeelden: [Poly Haven](https://polyhaven.com) (CC0), via de three.js-voorbeelden
- Demomodel: IFC-testbestand uit de web-ifc-repository (That Open Company)

---

Ontwikkeld in het kader van de masterproef *VR als leerhulpmiddel in bouwkundig onderwijs* (UGent, industriële wetenschappen bouwkunde).
