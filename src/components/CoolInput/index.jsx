/* eslint-disable */
import React from 'react';
import Vector from './vector';
import Particle from './particle';
import styles from './index.less';

export default class CoolInput extends React.Component {
    componentDidMount() {
        
        var MAX_LIFE = 50;
        var canvas = document.querySelector('canvas');
        var input = document.getElementById('cool_input');
        // console.log('input',input)
        let _this = window
        // console.log(_this)
        // console.log(input)
        var field = {}
        var caret = document.createElement('span');
        caret.style.cssText = document.defaultView.getComputedStyle(input, '').cssText;
        caret.style.position = 'absolute';
        caret.style.left = '0';
        caret.style.top = '0';
        caret.style.width = 'auto';
        caret.style.visibility = 'hidden';
        document.body.appendChild(caret);

        function reposition() {
            field = input.getBoundingClientRect();
        }
        window.onload = reposition;
        window.onresize = reposition;
        reposition();

        function burst(intensity) {
            // console.log('burst start')
            var behavior = [
                _this.behavior.cohesion(),
                _this.behavior.move()
            ];

            var size = .75;
            var force = .7;
            var lifeMin = 0;
            var progress = Math.min(field.width, caret.offsetWidth) / field.width;
            var offset = field.left + (field.width * progress);
            var rangeMin = Math.max(field.left, offset - 30);
            var rangeMax = Math.min(field.right, offset + 10);

            _this.spray(intensity, function() {
                return [
                    null, null,
                    Vector.create(
                        Random.between(rangeMin + 10, rangeMax - 20),
                        Random.between(field.top + 15, field.bottom - 15)
                    ),
                    Vector.random(force),
                    size + Math.random(),
                    Random.between(lifeMin, 0), behavior
                ]
            });

            // top edge
            _this.spray(intensity * .5, function() {
                return [
                    null, null,
                    Vector.create(
                        Random.between(rangeMin, rangeMax),
                        field.top
                    ),
                    Vector.random(force),
                    size + Math.random(),
                    Random.between(lifeMin, 0), behavior
                ]
            });

            // bottom edge
            _this.spray(intensity * .5, function() {
                return [
                    null, null,
                    Vector.create(
                        Random.between(rangeMin, rangeMax),
                        field.top + field.height
                    ),
                    Vector.random(force),
                    size + Math.random(),
                    Random.between(lifeMin, 0), behavior
                ]
            });

            // left edge
            if (input.value.length === 1) {
                _this.spray(intensity * 2, function() {
                    return [
                        null, null,
                        Vector.create(
                            field.left,
                            Random.between(field.top, field.bottom)
                        ),
                        Vector.random(force),
                        size + Math.random(),
                        Random.between(lifeMin, 0), behavior
                    ]
                });
            }

            // right edge
            if (rangeMax == field.right) {

                _this.spray(intensity * 2, function() {
                    return [
                        null, null,
                        Vector.create(
                            field.right,
                            Random.between(field.top, field.bottom)
                        ),
                        Vector.random(force),
                        size + Math.random(),
                        Random.between(lifeMin, 0), behavior
                    ]
                });

            }
            // console.log('burst end')
        }

        // start particle simulation
        simulate(
            '2d', {
                init: function() {
                },
                tick: function(particles) {
                    if (!particles) {
                        return;
                    }
                    particles.forEach(function(p) {
                        if (p.life > MAX_LIFE) {
                            _this.destroy(p);
                        }
                    });
                },
                beforePaint: function() {
                    _this.clear();
                },
                paint: function(particle) {
                    var p = particle.position;
                    var s = particle.size;
                    var o = 1 - (particle.life / MAX_LIFE);
                    _this.paint.circle(p.x, p.y, s, 'rgba(255,255,255,' + o + ')');
                    _this.paint.circle(p.x, p.y, s + 2, 'rgba(231,244,255,' + (o * .25) + ')');
                },
                afterPaint: function() {
                    // nohing
                },
                action: function(x, y) {
                    // console.log('action',input)
                    caret.textContent = input.value;
                    burst.call(_this, 10);
                    input.classList.add('keyup');
                    setTimeout(function() {
                        input.classList.remove('keyup')
                    }, 100);
                }
            }
        );

        /**
         * Random
         */
        var Random = {
            between: function(min, max) {
                return min + (Math.random() * (max - min));
            }
        }

        // setup DOM
        function simulate(dimensions, options) {

            // private vars
            var particles = [];
            var destroyed = [];
            var update = update || function() {};
            var stage = stage || function() {};
            // var canvas;
            var context;
            // console.log('simulate start')

            if (!options) {
                console.error('"options" object must be defined');
                return;
            }

            if (!options.init) {
                console.error('"init" function must be defined');
                return;
            }

            if (!options.paint) {
                console.error('"paint" function must be defined');
                return;
            }

            if (!options.tick) {
                options.tick = function() {};
            }

            if (!options.beforePaint) {
                options.beforePaint = function() {};
            }

            if (!options.afterPaint) {
                options.afterPaint = function() {};
            }

            if (!options.action) {
                options.action = function() {};
            }

            // console.log('before setup',document.readyState)
            // if (document.readyState === 'interactive') {
            //     setup();
            // } else {
            //     document.addEventListener('DOMContentLoaded', setup);
            // }

            // resizes canvas to fit window dimensions
            function fitCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }

            // create canvas for drawing
            function setup() {
                // create
                // console.log('setup')
                canvas = document.createElement('canvas');
                document.body.appendChild(canvas);
                // correct canvas size on window resize
                window.addEventListener('resize', fitCanvas);
                // go
                go();
            }
            // canvas has been attached, let's go!
            function go() {
                // set initial canvas size
                fitCanvas();
                // get context for drawing
                context = canvas.getContext(dimensions);
                // simulation update loop
                function act() {
                    // update particle states
                    var i = 0;
                    var l = particles.length;
                    var p;
                    for (; i < l; i++) {
                        particles[i].update(_this);
                    }
                    // clean destroyed particles
                    while (p = destroyed.pop()) {
                        do {
                            // has not been found in destroyed array?
                            if (p !== particles[i]) {
                                continue;
                            }
                            // remove particle
                            particles.splice(i, 1);
                        } while (i-- >= 0)
                    }
                    // repaint context
                    options.beforePaint.call(_this);
                    // repaint particles
                    i = 0;
                    l = particles.length;
                    for (; i < l; i++) {
                        options.paint.call(_this, particles[i]);
                    }
                    // after particles have been painted
                    options.afterPaint.call(_this);
                }

                function tick() {
                    // call update method, _this allows for inserting particles later on
                    options.tick.call(_this, particles);
                    // update particles here
                    act();
                    // on to the next frame
                    window.requestAnimationFrame(tick);
                }

                /**
                 * API
                 **/
                function clear() {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                }

                function destroy(particle) {
                    destroyed.push(particle);
                }

                function add(id, group, position, velocity, size, life, behavior) {
                    particles.push(new Particle(id, group, position, velocity, size, life, behavior));
                }

                function spray(amount, config) {
                    var i = 0;
                    for (; i < amount; i++) {
                        // console.log(add)
                        add.apply(_this, config());
                    }
                }

                function debug(particle) {
                    _this.paint.circle(
                        particle.position.x,
                        particle.position.y,
                        particle.size,
                        'rgba(255,0,0,.75)'
                    );
                    context.beginPath();
                    context.moveTo(particle.position.x, particle.position.y);
                    context.lineTo(particle.position.x + (particle.velocity.x * 10), particle.position.y + (particle.velocity.y * 10));
                    context.strokeStyle = 'rgba(255,0,0,.1)';
                    context.stroke();
                    context.closePath();
                };
                // console.log('clear _this',_this)
                _this.clear = clear;
                _this.destroy = destroy;
                _this.add = add;
                _this.spray = spray;
                _this.debug = debug;
                _this.paint = {
                    circle: function(x, y, size, color) {
                        context.beginPath();
                        context.arc(x, y, size, 0, 2 * Math.PI, false);
                        context.fillStyle = color;
                        context.fill();
                    },
                    square: function(x, y, size, color) {
                        context.beginPath();
                        context.rect(x - (size * .5), y - (size * .5), size, size);
                        context.fillStyle = color;
                        context.fill();
                    }
                }
                _this.behavior = {
                    cohesion: function(range, speed) {
                        range = Math.pow(range || 100, 2);
                        speed = speed || .001;
                        return function(particle) {

                            var center = new Vector();
                            var i = 0;
                            var l = particles.length;
                            var count = 0;

                            if (l <= 1) {
                                return;
                            }
                            for (; i < l; i++) {

                                // don't use self in group
                                if (particles[i] === particle || Vector.distanceSquared(particles[i].position, particle.position) > range) {
                                    continue;
                                }
                                center.add(Vector.subtract(particles[i].position, particle.position));
                                count++;
                            }
                            if (count > 0) {
                                center.divide(count);
                                center.normalize();
                                center.multiply(particle.velocity.magnitude);
                                center.multiply(.05);
                            }
                            particle.velocity.add(center);

                        }
                    },
                    separation: function(distance) {
                        var distance = Math.pow(distance || 25, 2);
                        return function(particle) {
                            var heading = new Vector();
                            var i = 0;
                            var l = particles.length;
                            var count = 0;
                            var diff;
                            if (l <= 1) {
                                return;
                            }
                            for (; i < l; i++) {
                                // don't use self in group
                                if (particles[i] === particle || Vector.distanceSquared(particles[i].position, particle.position) > distance) {
                                    continue;
                                }
                                // stay away from neighbours
                                diff = Vector.subtract(particle.position, particles[i].position);
                                diff.normalize();
                                heading.add(diff);
                                count++;
                            }
                            if (count > 0) {
                                // get average
                                heading.divide(count);
                                // make same length as current velocity (so particle won't speed up)
                                heading.normalize();
                                heading.multiply(particle.velocity.magnitude);
                                // limit force to make particle movement smoother
                                heading.limit(.1);
                            }
                            particle.velocity.add(heading);
                        }
                    },
                    alignment: function(range) {
                        range = Math.pow(range || 100, 2);
                        return function(particle) {
                            var i = 0;
                            var l = particles.length;
                            var count = 0;
                            var heading = new Vector();
                            if (l <= 1) {
                                return;
                            }
                            for (; i < l; i++) {
                                // don't use self in group also don't align when out of range
                                if (particles[i] === particle || Vector.distanceSquared(particles[i].position, particle.position) > range) {
                                    continue;
                                }
                                heading.add(particles[i].velocity);
                                count++;
                            }

                            if (count > 0) {
                                heading.divide(count);
                                heading.normalize();
                                heading.multiply(particle.velocity.magnitude);
                                // limit
                                heading.multiply(.1);

                            }
                            particle.velocity.add(heading);
                        }
                    },
                    move: function() {
                        return function(particle) {
                            particle.position.add(particle.velocity);
                            // handle collisions?
                        }
                    },
                    eat: function(food) {
                        food = food || [];
                        return function(particle) {
                            var i = 0;
                            var l = particles.length;
                            var prey;
                            for (; i < l; i++) {
                                prey = particles[i];
                                // can't eat itself, also, needs to be tasty
                                if (prey === particle || food.indexOf(prey.group) === -1) {
                                    continue;
                                }
                                // calculate force vector
                                if (Vector.distanceSquared(particle.position, neighbour.position) < 2 && particle.size >= neighbour.size) {
                                    particle.size += neighbour.size;
                                    destroy(neighbour);
                                }
                            }
                        }
                    },
                    force: function(x, y) {
                        return function(particle) {
                            particle.velocity.x += x;
                            particle.velocity.y += y;
                        }
                    },
                    limit: function(treshold) {
                        return function(particle) {
                            particle.velocity.limit(treshold);
                        }
                    },
                    attract: function(forceMultiplier, groups) {
                        forceMultiplier = forceMultiplier || 1;
                        groups = groups || [];
                        return function(particle) {
                            // attract other particles
                            var totalForce = new Vector(0, 0);
                            var force = new Vector(0, 0);
                            var i = 0;
                            var l = particles.length;
                            var distance;
                            var pull;
                            var attractor;
                            var grouping = groups.length;
                            for (; i < l; i++) {
                                attractor = particles[i];
                                // can't be attracted by itself or mismatched groups
                                if (attractor === particle || (grouping && groups.indexOf(attractor.group) === -1)) {
                                    continue;
                                }
                                // calculate force vector
                                force.x = attractor.position.x - particle.position.x;
                                force.y = attractor.position.y - particle.position.y;
                                distance = force.magnitude;
                                force.normalize();
                                // the bigger the attractor the more force
                                force.multiply(attractor.size / distance);
                                totalForce.add(force);
                            }
                            totalForce.multiply(forceMultiplier);
                            particle.velocity.add(totalForce);
                        }
                    },
                    wrap: function(margin) {
                        return function(particle) {
                            // move around when particle reaches edge of screen
                            var position = particle.position;
                            var radius = particle.size * .5;
                            if (position.x + radius > canvas.width + margin) {
                                position.x = radius;
                            }
                            if (position.y + radius > canvas.height + margin) {
                                position.y = radius;
                            }
                            if (position.x - radius < -margin) {
                                position.x = canvas.width - radius;
                            }
                            if (position.y - radius < -margin) {
                                position.y = canvas.height - radius;
                            }
                        }
                    },
                    reflect: function() {
                        return function(particle) {
                            // bounce from edges
                            var position = particle.position;
                            var velocity = particle.velocity;
                            var radius = particle.size * .5;
                            if (position.x + radius > canvas.width) {
                                velocity.x = -velocity.x;
                            }

                            if (position.y + radius > canvas.height) {
                                velocity.y = -velocity.y;
                            }

                            if (position.x - radius < 0) {
                                velocity.x = -velocity.x;
                            }

                            if (position.y - radius < 0) {
                                velocity.y = -velocity.y;
                            }
                        }

                    },
                    edge: function(action) {
                        return function(particle) {
                            var position = particle.position;
                            var velocity = particle.velocity;
                            var radius = particle.size * .5;
                            if (position.x + radius > canvas.width) {
                                action(particle);
                            }
                            if (position.y + radius > canvas.height) {
                                action(particle);
                            }
                            if (position.x - radius < 0) {
                                action(particle);
                            }
                            if (position.y - radius < 0) {
                                action(particle);
                            }
                        }
                    }
                }

                // public
                Object.defineProperties(_this, {
                    'particles': {
                        get: function() {
                            return particles;
                        }
                    },
                    'width': {
                        get: function() {
                            return canvas.width;
                        }
                    },
                    'height': {
                        get: function() {
                            return canvas.height;
                        }
                    },
                    'context': {
                        get: function() {
                            return context;
                        }
                    }
                });
                // call init method so the scene can be setup
                options.init.call(_this)
                // start ticking
                tick();
                // start listening to events
                var self = _this;
                // console.log('bind key up',self)
                document.addEventListener('keyup', function(e) {
                    options.action.call(self, e.pageX, e.pageY);
                });
            }
            setup();
        };
    }

    render() {
        return (
            <div>
                <input id="cool_input" className={styles.coolInput} placeholder="请输入关键词"/>
            </div>
        );
    }
}
