# Training initiatives in the Netherlands

Interactive map of research training initiatives collected during the SURF Research Day 2026 Challenge Session on Training Initiatives.
This session was organized by: 

- Peter Hinrich (SURF)
- Sanne Tonkens (SURF)
- Jolien Scholten (VU)
- Marcel Ras (VU)
- Bjorn Bartholdy (TU Delft)
- Fenne Riemslagh (eScience Center)
- Eva Lekkerkerker (eScience Center)

Link to map: https://rst-nl.github.io/training-initiatives-map/

The online version of the dataset is cleaned to delete personal contact details, enrich with links to webpages, and retain entries with incomplete information. 

The map reports initiatives that have a mapped mainland or Dutch Caribbean
location. Search, coverage, topic, and location filters update the map and
results together; multi-level initiatives appear under each applicable coverage
filter. City markers show the number of matching initiatives and focus the
results on that location. Selecting a result highlights its city and opens one
details popup.

On screens up to 850 pixels wide, use the **Map** and **Results** control to
switch between the two surfaces without losing filters or selection. Controls
have visible labels and keyboard focus states, and motion follows the operating
system's reduced-motion preference.

## Local preview

No build step or package installation is required. From this directory, run:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. Run the static UI contract tests with
`node --test`.

Missing your training initiative in this interactive map or want to suggest
an improvement? Send an e-mail to rstnl@esciencecenter.nl
