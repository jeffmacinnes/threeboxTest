<script>
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import { updateLayers } from './layerTest.js';

	let map = null;
	let mapRef;
	let mapStyle = 'mapbox://styles/urbaninstitute/cleoryx1x000101my2y9cr08m';

	let initialViewState = {
		latitude: 47.6902776115618,
		longitude: -122.32872768455995,
		pitch: 60,
		bearing: -30,
		zoom: 16
	};

	onMount(() => {
		// setup mapbox
		map = new mapboxgl.Map({
			accessToken:
				'pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiY2xleWxpM3RoMDJpMjN5cDF0bmgwbTl1aiJ9.yDuyMZt7t53DlK-ps_p-Sg',
			container: mapRef,
			antialias: true,
			dragPan: true,
			dragRotate: false,
			scrollZoom: false,
			style: mapStyle,
			center: [initialViewState.longitude, initialViewState.latitude],
			zoom: initialViewState.zoom,
			pitch: initialViewState.pitch,
			bearing: initialViewState.bearing
		});
		map.on('style.load', function () {
			map.resize();
			updateLayers(map);
		});

		map.dragPan.enable();
		map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'bottom-right');
	});
</script>

<div class="map-container">
	<div id="map" bind:this={mapRef} />
</div>

<style lang="scss">
	.map-container {
		position: static;
		width: 100%;
		height: 100%;
		// min-height: 300px;
		border: solid 1px var(--color-white);
	}

	#map {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		// border: solid 1px blue;
	}
</style>
