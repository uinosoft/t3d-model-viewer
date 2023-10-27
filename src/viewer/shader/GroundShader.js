export const GroundShader = {
	name: 'GroundShader',

	uniforms: {
		size: 30,
		color: [1., 1., 1., 1.],
		gridSize: 5,
		gridSize2: 1,
		gridColor: [0, 0, 0, 1],
		gridColor2: [0.5, 0.5, 0.5, 1],
		showGrid: false
	},

	vertexShader: `
    #include <common_vert>
    #include <normal_pars_vert>
    #include <color_pars_vert>
    #include <modelPos_pars_vert>
    #include <shadowMap_pars_vert>

        varying vec3 v_WorldPosition;

        void main() {
            #include <begin_vert>
            #include <pvm_vert>
            #include <normal_vert>
            #include <color_vert>
            #include <modelPos_vert>
            v_WorldPosition = (u_Model * vec4( a_Position, 1.0 )).xyz;
            #include <shadowMap_vert>
        }
    `,

	fragmentShader: `
        uniform float size;
        uniform vec4 color;
        uniform float gridSize;
        uniform float gridSize2;
        uniform vec4 gridColor;
        uniform vec4 gridColor2;
        uniform bool showGrid;
		varying vec3 v_WorldPosition;

        #include <common_frag>

        #include <color_pars_frag>
        #include <light_pars_frag>
        #include <normal_pars_frag>
        #include <modelPos_pars_frag>
        #include <bsdfs>
        #include <shadowMap_pars_frag>

		void main() {
            vec4 groundColor = color;

            if (showGrid) {
                float wx = v_WorldPosition.x;
                float wz = v_WorldPosition.z;
                float x0 = abs(fract(wx / gridSize - 0.5) - 0.5) / fwidth(wx) * gridSize / 2.0;
                float z0 = abs(fract(wz / gridSize - 0.5) - 0.5) / fwidth(wz) * gridSize / 2.0;
        
                float x1 = abs(fract(wx / gridSize2 - 0.5) - 0.5) / fwidth(wx) * gridSize2;
                float z1 = abs(fract(wz / gridSize2 - 0.5) - 0.5) / fwidth(wz) * gridSize2;
        
                float v0 = 1.0 - clamp(min(x0, z0), 0.0, 1.0);
                float v1 = 1.0 - clamp(min(x1, z1), 0.0, 1.0);
                if (v0 > 0.1) {
                    groundColor = mix(groundColor, gridColor, v0);
                } else {
                    groundColor = mix(groundColor, gridColor2, v1);
                }
            }

            groundColor.a *= 1.0 - clamp(length(v_WorldPosition.xz) / size, 0.0, 1.0);

            vec4 outColor = groundColor;

            #include <color_frag>
            #include <normal_frag>

            ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
            #include <light_frag>
            outColor.xyz = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;

            #include <shadowMap_frag>

            gl_FragColor = outColor;

		}

	`
};