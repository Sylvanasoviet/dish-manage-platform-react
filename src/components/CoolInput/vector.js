/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
const PI_HALF = Math.PI / 2;
const PI_180 = Math.PI / 180;
export default function Vector(x, y) {
    this._x = x || 0;
    this._y = y || 0;
}

Vector.create = function(x, y) {
    return new Vector(x, y);
};

Vector.add = function(a, b) {
    return new Vector(a.x + b.x, a.y + b.y);
};

Vector.subtract = function(a, b) {
    return new Vector(a.x - b.x, a.y - b.y);
};

Vector.random = function(range) {
    const v = new Vector();
    v.randomize(range);
    return v;
};

Vector.distanceSquared = function(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
};

Vector.distance = function(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
};

Vector.prototype = {
    get x() {
        return this._x;
    },
    get y() {
        return this._y;
    },
    set x(value) {
        this._x = value;
    },
    set y(value) {
        this._y = value;
    },
    get magnitudeSquared() {
        return this._x * this._x + this._y * this._y;
    },
    get magnitude() {
        return Math.sqrt(this.magnitudeSquared);
    },
    get angle() {
        return Math.atan2(this._y, this._x) * 180 / Math.PI;
    },
    clone() {
        return new Vector(this._x, this._y);
    },
    add(v) {
        this._x += v.x;
        this._y += v.y;
    },
    subtract(v) {
        this._x -= v.x;
        this._y -= v.y;
    },
    multiply(value) {
        this._x *= value;
        this._y *= value;
    },
    divide(value) {
        this._x /= value;
        this._y /= value;
    },
    normalize() {
        const { magnitude } = this;
        if (magnitude > 0) {
            this.divide(magnitude);
        }
    },
    limit(treshold) {
        if (this.magnitude > treshold) {
            this.normalize();
            this.multiply(treshold);
        }
    },
    randomize(amount) {
        amount = amount || 1;
        this._x = amount * 2 * (-0.5 + Math.random());
        this._y = amount * 2 * (-0.5 + Math.random());
    },
    rotate(degrees) {
        const { magnitude } = this;
        const angle = ((Math.atan2(this._x, this._y) * PI_HALF) + degrees) * PI_180;
        this._x = magnitude * Math.cos(angle);
        this._y = magnitude * Math.sin(angle);
    },
    flip() {
        const temp = this._y;
        this._y = this._x;
        this._x = temp;
    },
    invert() {
        this._x = -this._x;
        this._y = -this._y;
    },
    toString() {
        return `${this._x}, ${this._y}`;
    },
}
