import { Threebox, THREE } from 'threebox-plugin';

export const updateLayers = (map) => {
	let origin = [-122.32872768455995, 47.6902776115618, 1];

	map.addLayer({
		id: 'custom_layer',
		type: 'custom',
		renderingMode: '3d',
		onAdd: function (map, mbxContext) {
			// instantiate threebox
			window.tb = new Threebox(map, mbxContext, {
				defaultLights: true,
				enableSelectingObjects: true
			});

			//instantiate a red sphere and position it at the origin lnglat
			var sphere = tb.sphere({ color: 'red', material: 'MeshToonMaterial' }).setCoords(origin);
			sphere.addEventListener('ObjectMouseOver', onObjectMouseOver, false);
			sphere.addEventListener('ObjectMouseOut', onObjectMouseOut, false);
			// add sphere to the scene
			tb.add(sphere);
		},

		render: function (gl, matrix) {
			tb.update();
		}
	});

	//actions to execute onObjectMouseOver
	function onObjectMouseOver(e) {
		console.log('ObjectMouseOver: ' + e.detail.name);
	}

	//actions to execute onObjectMouseOut
	function onObjectMouseOut(e) {
		console.log('ObjectMouseOut: ' + e.detail.name);
	}
};
