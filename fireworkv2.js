            var lighten = (function () {
                var bgcan = document.createElement('canvas');
                document.body.appendChild(bgcan);
                return function (can) {
                    bgcan.width = can.width;
                    bgcan.height = can.height;
                    bgcan.getContext('2d').drawImage(can, 0, 0);
                    can.width = can.width;
                    // this is where you have to draw the image behind the fireworks again or erase the canvas that is positioned on top of the 
                    can.getContext('2d').globalAlpha = 0.9;
                    can.getContext('2d').drawImage(bgcan, 0, 0);
                    can.getContext('2d').globalAlpha = 1;
                };
            })();
            var canvas;
            var context;
            var proton;
            var renderer;
            var emitter;
            var stats;

            Main();

            function Main() {
                canvas = document.getElementsByTagName("canvas")[0];
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                context = canvas.getContext('2d');
                //context.globalCompositeOperation = "lighter";
                addStats();

                createProton();
                tick();
            }

            function addStats() {
                stats = new Stats();
                stats.setMode(2);
                stats.domElement.style.position = 'absolute';
                stats.domElement.style.left = '0px';
                stats.domElement.style.top = '0px';
             
            }

            function createProton(image) {
                proton = new Proton;
                emitter = new Proton.Emitter();
                emitter.rate = new Proton.Rate(new Proton.Span(1, 3), 1);
                emitter.addInitialize(new Proton.Mass(1));
                emitter.addInitialize(new Proton.Radius(2, 4));
                emitter.addInitialize(new Proton.P(new Proton.LineZone(10, canvas.height, canvas.width - 10, canvas.height)));
                emitter.addInitialize(new Proton.Life(1, 1.5));
                emitter.addInitialize(new Proton.V(new Proton.Span(4, 6), new Proton.Span(0, 0, true), 'polar'));
                emitter.addBehaviour(new Proton.Gravity(1));
                emitter.addBehaviour(new Proton.Color('#ff0000', 'random'));
                emitter.emit();
                proton.addEmitter(emitter);

                renderer = new Proton.Renderer('canvas', proton, canvas);
                renderer.onProtonUpdate = function () {
                    lighten(context.canvas);
                };
                renderer.start();

                ////NOTICE :you can only use two emitters do this effect.In this demo I use more emitters want to test the emtter's life
                emitter.addEventListener(Proton.PARTICLE_DEAD, function (e) {
                    if (Math.random() < .7) createFirstEmitter(e.particle);
                    else createSecendEmitter(e.particle);
                });
            }

            function createFirstEmitter(particle) {
                var subemitter = new Proton.Emitter();
                subemitter.rate = new Proton.Rate(new Proton.Span(250, 300), 1);
                subemitter.addInitialize(new Proton.Mass(1));
                subemitter.addInitialize(new Proton.Radius(1, 2));
                subemitter.addInitialize(new Proton.Life(1, 3));
                subemitter.addInitialize(new Proton.V(new Proton.Span(2, 4), new Proton.Span(0, 360), 'polar'));
                subemitter.addBehaviour(new Proton.RandomDrift(10, 10, .05));
                subemitter.addBehaviour(new Proton.Alpha(1, 0));
                subemitter.addBehaviour(new Proton.Gravity(3));
                var color = Math.random() > .3 ? Proton.MathUtils.randomColor() : 'random';
                subemitter.addBehaviour(new Proton.Color(color));
                subemitter.p.x = particle.p.x;
                subemitter.p.y = particle.p.y;
                subemitter.emit('once', true);
                proton.addEmitter(subemitter);
            }

            function createSecendEmitter(particle) {
                var subemitter = new Proton.Emitter();
                subemitter.rate = new Proton.Rate(new Proton.Span(100, 120), 1);
                subemitter.addInitialize(new Proton.Mass(1));
                subemitter.addInitialize(new Proton.Radius(4, 8));
                subemitter.addInitialize(new Proton.Life(1, 2));
                subemitter.addInitialize(new Proton.V([1, 2], new Proton.Span(0, 360), 'polar'));
                subemitter.addBehaviour(new Proton.Alpha(1, 0));
                subemitter.addBehaviour(new Proton.Scale(1, .1));
                subemitter.addBehaviour(new Proton.Gravity(1));
                var color = Proton.MathUtils.randomColor();
                subemitter.addBehaviour(new Proton.Color(color));
                subemitter.p.x = particle.p.x;
                subemitter.p.y = particle.p.y;
                subemitter.emit('once', true);
                proton.addEmitter(subemitter);
            }

            function tick() {
                requestAnimationFrame(tick);

                stats.begin();
                proton.update();
                stats.end();
            }