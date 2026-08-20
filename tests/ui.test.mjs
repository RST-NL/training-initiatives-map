import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

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
  assert.match(html, /classList\.toggle\('selected',\s*isSelected\)/);
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

test('initiative markers do not wait for PDOK raster loading', () => {
  assert.doesNotMatch(html, /map\.on\('load',\(\)=>\{createMarkers\(\)/);
  assert.match(html, /createMarkers\(\);\s*render\(\);\s*search\.addEventListener/);
});

test('mobile layout presents one non-scrolling surface at a time', () => {
  assert.match(html, /@media\s*\(max-width:\s*850px\)[\s\S]*?\.layout\[data-mobile-view="map"\][\s\S]*?\.list-panel\s*\{\s*display:\s*none/);
  assert.match(html, /@media\s*\(max-width:\s*850px\)[\s\S]*?\.layout\[data-mobile-view="results"\][\s\S]*?\.map-panel\s*\{\s*display:\s*none/);
  assert.match(html, /@media\s*\(max-width:\s*850px\)[\s\S]*?\.list-panel\s*\{[^}]*max-height:\s*none[^}]*overflow:\s*visible/s);
});
