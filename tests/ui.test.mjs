import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('RST-NL brand palette uses exact tokens without acid lime', () => {
  for (const token of ['#FC4C59', '#142832', '#FFFFFF', '#E6F4F8', '#F7F7F7', '#222222']) {
    assert.match(html, new RegExp(token, 'i'), `missing brand token ${token}`);
  }
  assert.doesNotMatch(html, /#C9FF3D/i);
});

test('focus indicators use white and navy tones across light and dark surfaces', () => {
  const focusRule = html.match(/button:focus-visible[^}]+}/)?.[0] ?? '';

  assert.match(focusRule, /outline:\s*[^;]*var\(--surface\)/);
  assert.match(focusRule, /box-shadow:\s*[^;]*var\(--navy\)/);
});

test('search and level controls use visible labels', () => {
  assert.match(html, /<label[^>]+for="search"[^>]*>\s*Search/i);
  assert.match(html, /<label[^>]+for="level"[^>]*>\s*(Scope|Coverage|Level)/i);
});

test('mobile view control exposes accessible Map and Results buttons', () => {
  assert.match(html, /class="[^"]*view-toggle[^"]*"[^>]+aria-label="Choose view"/i);
  assert.match(html, /<button[^>]+data-view="map"[^>]+aria-pressed="true"[^>]*>\s*Map\s*</i);
  assert.match(html, /<button[^>]+data-view="results"[^>]+aria-pressed="false"[^>]*>\s*Results\s*</i);
});

test('count reports mapped initiatives instead of every source record', () => {
  assert.match(html, /const mappedInitiatives\s*=\s*initiatives\.filter\(i\s*=>\s*i\.city\s*\|\|\s*i\.kind\s*===\s*'caribbean'\)/);
  assert.match(html, /mapped initiatives/);
});

test('mixed levels match every relevant level filter', () => {
  assert.match(html, /i\.level\.split\('\/'\)\.includes\(level\.value\)/);
});

test('reduced-motion preference disables animated map and scroll movement', () => {
  assert.match(html, /prefers-reduced-motion:\s*reduce/);
  assert.match(html, /const prefersReducedMotion\s*=\s*window\.matchMedia\('\(prefers-reduced-motion: reduce\)'\)/);
  assert.match(html, /behavior:\s*prefersReducedMotion\.matches\s*\?\s*'auto'\s*:\s*'smooth'/);
});

test('selection synchronizes marker and list semantics with one popup', () => {
  assert.match(html, /setAttribute\('aria-pressed',\s*String\(isSelected\)\)/);
  assert.match(html, /listPanel\.scrollTop\s*=\s*item\.offsetTop-listPanel\.offsetTop/);
  assert.match(html, /closeAllPopups\(\)/);
  assert.match(html, /classList\.toggle\('contains-selected',\s*selectedCity === city\)/);
});

test('filtering away the selected initiative clears its details and selection semantics', () => {
  assert.match(html, /function clearSelection\(\)\s*\{\s*closeAllPopups\(\);\s*select\(null\);\s*\}/);
  assert.match(html, /function render\(\)\s*\{\s*const filtered = shown\(\);\s*if\(selectedId !== null && !filtered\.some\(i\s*=>\s*i\.id === selectedId\)\) clearSelection\(\);/);
});

test('details popup is app-owned to prevent duplicate marker toggles', () => {
  assert.match(html, /const popups = new Map\(\)/);
  assert.doesNotMatch(html, /\.setPopup\(/);
  assert.match(html, /popup\.setLngLat\(marker\.getLngLat\(\)\)\.addTo\(map\)/);
  assert.match(html, /\.maplibregl-popup\s*\{\s*z-index:\s*5/);
});

test('PDOK raster receives calm-map paint treatment', () => {
  assert.match(html, /'raster-saturation':\s*-0\.[1-9]/);
  assert.match(html, /'raster-contrast':\s*-0\.[0-9]+/);
  assert.match(html, /'raster-brightness-max':\s*0\.[0-9]+/);
});

test('city markers do not wait for PDOK raster loading', () => {
  assert.doesNotMatch(html, /map\.on\('load',\(\)=>\{createCityMarkers\(\)/);
  assert.match(html, /createCityMarkers\(\);\s*render\(\);\s*search\.addEventListener/);
});

test('mobile layout presents one non-scrolling surface at a time', () => {
  assert.match(html, /@media\s*\(max-width:\s*850px\)[\s\S]*?\.layout\[data-mobile-view="map"\][\s\S]*?\.list-panel\s*\{\s*display:\s*none/);
  assert.match(html, /@media\s*\(max-width:\s*850px\)[\s\S]*?\.layout\[data-mobile-view="results"\][\s\S]*?\.map-panel\s*\{\s*display:\s*none/);
  assert.match(html, /@media\s*\(max-width:\s*850px\)[\s\S]*?\.list-panel\s*\{[^}]*max-height:\s*none[^}]*overflow:\s*visible/s);
});

test('mobile interactive controls retain 44px touch targets', () => {
  assert.match(html, /\.filter-summary button\s*\{[^}]*min-height:\s*44px/s);
  assert.match(html, /\.map-pin\s*\{[^}]*min-width:\s*44px[^}]*height:\s*44px/s);
  assert.match(html, /@media\s*\(max-width:\s*850px\)[\s\S]*?\.caribbean-inset summary[^}]*min-height:\s*44px/s);
  assert.match(html, /@media\s*\(max-width:\s*850px\)[\s\S]*?\.map-tooltip > button[^}]*width:\s*44px[^}]*height:\s*44px/s);
  assert.match(html, /@media\s*\(max-width:\s*850px\)[\s\S]*?\.maplibregl-ctrl-attrib-button[^}]*min-width:\s*44px[^}]*min-height:\s*44px/s);
});

test('topic taxonomy is deterministic and exposed as live filter buttons', () => {
  assert.match(html, /const topics\s*=\s*\['Software & coding','Data & FAIR','HPC & cloud','Community & support','AI & digital skills','Other'\]/);
  assert.match(html, /function topicFor\(initiative\)/);
  assert.match(html, /class="topics"[^>]+aria-label="Explore by topic"/);
  assert.match(html, /data-topic/);
  assert.match(html, /aria-pressed/);
  assert.match(html, /topicFor\(i\)/);
});

test('mainland markers aggregate initiatives by city and expose matching counts', () => {
  assert.match(html, /const cityGroups\s*=\s*new Map\(\)/);
  assert.match(html, /function createCityMarkers\(\)/);
  assert.match(html, /element\.textContent\s*=\s*String\(count\)/);
  assert.match(html, /setAttribute\('aria-label',\s*`\$\{city\}, \$\{count\}/);
  assert.doesNotMatch(html, /initiatives\.filter\(i=>i\.city\)\.forEach\(i=>/);
});

test('crowded Randstad markers use deterministic offsets from true city anchors', () => {
  assert.match(html, /const markerOffsets\s*=\s*\{[\s\S]*?'Den Haag':\s*\[-24,-16\][\s\S]*?Delft:\s*\[22,10\][\s\S]*?Rotterdam:\s*\[-18,24\][\s\S]*?Leiden:\s*\[20,-20\][\s\S]*?\}/);
  assert.match(html, /new maplibregl\.Marker\(\{element,anchor:'center',offset:markerOffsets\[city\]\s*\|\|\s*\[0,0\]\}\)/);
});

test('city filtering has independent active state and reset', () => {
  assert.match(html, /let activeCity\s*=\s*''/);
  assert.match(html, /id="location-reset"/);
  assert.match(html, /Show all locations/);
  assert.match(html, /function setActiveCity\(city\)/);
  assert.match(html, /locationReset\.addEventListener\('click',\s*\(\)=>setActiveCity\(''\)\)/);
});

test('location and full resets restore the reduced-motion-aware overview camera', () => {
  assert.match(html, /const initialCamera\s*=\s*\{center:\[5\.32,52\.18\],zoom:6\.7\}/);
  assert.match(html, /function resetOverviewCamera\(\)\s*\{\s*if\(prefersReducedMotion\.matches\) map\.jumpTo\(initialCamera\); else map\.easeTo\(\{\.\.\.initialCamera,duration:650\}\);\s*\}/);
  assert.match(html, /function setActiveCity\(city\)[\s\S]*?if\(!city\) resetOverviewCamera\(\)/);
  assert.match(html, /getElementById\('reset-all'\)\.addEventListener\('click',[\s\S]*?resetOverviewCamera\(\)/);
});

test('filtering intersects query, coverage, topic, and city', () => {
  assert.match(html, /const matchesTopic\s*=\s*!activeTopic\s*\|\|\s*topicFor\(i\)\s*===\s*activeTopic/);
  assert.match(html, /const matchesCity\s*=\s*!activeCity\s*\|\|\s*locationKey\(i\)\s*===\s*activeCity/);
  assert.match(html, /return matchesQuery && matchesLevel && matchesTopic && matchesCity/);
});

test('topic and city counts avoid circular disappearance', () => {
  assert.match(html, /function matchesBaseFilters\(i\)/);
  assert.match(html, /function topicCount\(topic\)/);
  assert.match(html, /function cityCount\(city\)/);
  assert.match(html, /topic buttons ignore active topic; city markers ignore active city/i);
});

test('bold map-first composition keeps controls and map above fold', () => {
  assert.match(html, /class="app-header"/);
  assert.match(html, /class="discovery"/);
  assert.match(html, /class="map-instruction"[^>]*>\s*Choose a city to focus results/);
  assert.match(html, /grid-template-columns:\s*minmax\(0,\s*2fr\)\s+minmax\(300px,\s*1fr\)/);
  assert.match(html, /--accent:\s*#[0-9a-f]{6}/i);
  assert.match(html, /transition:[^;]*(160|180|200|220)ms/);
});

test('visible brand uses official RST-NL spelling', () => {
  assert.match(html, /class="brand"[^>]*>RST-NL<\/p>/);
  assert.doesNotMatch(html, />RST—NL<\/p>/);
});
