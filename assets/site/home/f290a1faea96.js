/* Three.js r185 — MIT, Copyright 2010-2026 Three.js Authors. Bundled locally for the record player. */
window.LuliyLoadThree=function(){if(window.LuliyThree)return window.LuliyThree;
/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Pp="185";const Lp=1;const Dp=0,Ip=1,Fp=2,Np=0,Up=1;const Op=5,Bp=100;const Gp=200,Vp=201;const zp=204,Hp=205;const kp=3;const Wp=0,Xp=1,qp=2,Yp=3,Zp=4,Jp=5,Kp=6,$p=7,Qp=300;const jp=303;const em=1e3,tm=1001;const nm=1003;const im=1006;const rm=1008,sm=1009,am=1010,om=1011,lm=1012,cm=1013,hm=1014,um=1015,fm=1016;const dm=1023;const pm=1028,mm=1029,gm=1030,_m=1031,vm=1033;const xm="",Gt="srgb",fr="srgb-linear",dr="linear",lt="srgb";const Sm=35044,Ns="300 es";function Vo(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Ci(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function zo(){const i=Ci("canvas");return i.style.display="block",i}const Us={};function Os(...i){const e="THREE."+i.shift();console.log(e,...i)}function Ya(i){const e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Oe(...i){i=Ya(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function je(...i){i=Ya(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function ri(...i){const e=i.join(" ");e in Us||(Us[e]=!0,Oe(...i))}function Ho(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}const ko={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3};class Dn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const r=n[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Ct=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Bs=1234567;const Ti=Math.PI/180,wi=180/Math.PI;function In(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ct[i&255]+Ct[i>>8&255]+Ct[i>>16&255]+Ct[i>>24&255]+"-"+Ct[e&255]+Ct[e>>8&255]+"-"+Ct[e>>16&15|64]+Ct[e>>24&255]+"-"+Ct[t&63|128]+Ct[t>>8&255]+"-"+Ct[t>>16&255]+Ct[t>>24&255]+Ct[n&255]+Ct[n>>8&255]+Ct[n>>16&255]+Ct[n>>24&255]).toLowerCase()}function ze(i,e,t){return Math.max(e,Math.min(t,i))}function hs(i,e){return(i%e+e)%e}function Wo(i,e,t,n,r){return n+(i-e)*(r-n)/(t-e)}function Xo(i,e,t){return i!==e?(t-i)/(e-i):0}function bi(i,e,t){return(1-t)*i+t*e}function qo(i,e,t,n){return bi(i,e,1-Math.exp(-t*n))}function Yo(i,e=1){return e-Math.abs(hs(i,e*2)-e)}function Zo(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Jo(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Ko(i,e){return i+Math.floor(Math.random()*(e-i+1))}function $o(i,e){return i+Math.random()*(e-i)}function Qo(i){return i*(.5-Math.random())}function jo(i){i!==void 0&&(Bs=i);let e=Bs+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function el(i){return i*Ti}function tl(i){return i*wi}function nl(i){return(i&i-1)===0&&i!==0}function il(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function rl(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function sl(i,e,t,n,r){const s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+n)/2),u=a((e+n)/2),f=s((e-n)/2),h=a((e-n)/2),d=s((n-e)/2),g=a((n-e)/2);switch(r){case"XYX":i.set(o*u,l*f,l*h,o*c);break;case"YZY":i.set(l*h,o*u,l*f,o*c);break;case"ZXZ":i.set(l*f,l*h,o*u,o*c);break;case"XZX":i.set(o*u,l*g,l*d,o*c);break;case"YXY":i.set(l*d,o*u,l*g,o*c);break;case"ZYZ":i.set(l*g,l*d,o*u,o*c);break;default:Oe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function ni(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Pt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Mm={DEG2RAD:Ti,RAD2DEG:wi,generateUUID:In,clamp:ze,euclideanModulo:hs,mapLinear:Wo,inverseLerp:Xo,lerp:bi,damp:qo,pingpong:Yo,smoothstep:Zo,smootherstep:Jo,randInt:Ko,randFloat:$o,randFloatSpread:Qo,seededRandom:jo,degToRad:el,radToDeg:tl,isPowerOfTwo:nl,ceilPowerOfTwo:il,floorPowerOfTwo:rl,setQuaternionFromProperEuler:sl,normalize:Pt,denormalize:ni};class le{static{le.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ze(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*r+e.x,this.y=s*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ci{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,a,o){let l=n[r+0],c=n[r+1],u=n[r+2],f=n[r+3],h=s[a+0],d=s[a+1],g=s[a+2],M=s[a+3];if(f!==M||l!==h||c!==d||u!==g){let m=l*h+c*d+u*g+f*M;m<0&&(h=-h,d=-d,g=-g,M=-M,m=-m);let p=1-o;if(m<.9995){const y=Math.acos(m),E=Math.sin(y);p=Math.sin(p*y)/E,o=Math.sin(o*y)/E,l=l*p+h*o,c=c*p+d*o,u=u*p+g*o,f=f*p+M*o}else{l=l*p+h*o,c=c*p+d*o,u=u*p+g*o,f=f*p+M*o;const y=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=y,c*=y,u*=y,f*=y}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,r,s,a){const o=n[r],l=n[r+1],c=n[r+2],u=n[r+3],f=s[a],h=s[a+1],d=s[a+2],g=s[a+3];return e[t]=o*g+u*f+l*d-c*h,e[t+1]=l*g+u*h+c*f-o*d,e[t+2]=c*g+u*d+o*h-l*f,e[t+3]=u*g-o*f-l*h-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(r/2),f=o(s/2),h=l(n/2),d=l(r/2),g=l(s/2);switch(a){case"XYZ":this._x=h*u*f+c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f-h*d*g;break;case"YXZ":this._x=h*u*f+c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f+h*d*g;break;case"ZXY":this._x=h*u*f-c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f-h*d*g;break;case"ZYX":this._x=h*u*f-c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f+h*d*g;break;case"YZX":this._x=h*u*f+c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f-h*d*g;break;case"XZY":this._x=h*u*f-c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f+h*d*g;break;default:Oe("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],f=t[10],h=n+o+f;if(h>0){const d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(u-l)*d,this._y=(s-c)*d,this._z=(a-r)*d}else if(n>o&&n>f){const d=2*Math.sqrt(1+n-o-f);this._w=(u-l)/d,this._x=.25*d,this._y=(r+a)/d,this._z=(s+c)/d}else if(o>f){const d=2*Math.sqrt(1+o-n-f);this._w=(s-c)/d,this._x=(r+a)/d,this._y=.25*d,this._z=(l+u)/d}else{const d=2*Math.sqrt(1+f-n-o);this._w=(a-r)/d,this._x=(s+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ze(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+r*c-s*l,this._y=r*u+a*l+s*o-n*c,this._z=s*u+a*c+n*l-r*o,this._w=a*u-n*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,s=-s,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+n*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{static{D.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Gs.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Gs.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*n),u=2*(o*t-s*r),f=2*(s*n-a*t);return this.x=t+l*c+a*f-o*u,this.y=n+l*u+o*c-s*f,this.z=r+l*f+s*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this.z=ze(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this.z=ze(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-n*l,this.z=n*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Tr.copy(this).projectOnVector(e),this.sub(Tr)}reflect(e){return this.sub(Tr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ze(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Tr=new D,Gs=new ci;class qe{static{qe.prototype.isMatrix3=!0}constructor(e,t,n,r,s,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c)}set(e,t,n,r,s,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=s,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],f=n[7],h=n[2],d=n[5],g=n[8],M=r[0],m=r[3],p=r[6],y=r[1],E=r[4],v=r[7],R=r[2],T=r[5],P=r[8];return s[0]=a*M+o*y+l*R,s[3]=a*m+o*E+l*T,s[6]=a*p+o*v+l*P,s[1]=c*M+u*y+f*R,s[4]=c*m+u*E+f*T,s[7]=c*p+u*v+f*P,s[2]=h*M+d*y+g*R,s[5]=h*m+d*E+g*T,s[8]=h*p+d*v+g*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*s*u+n*o*l+r*s*c-r*a*l}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=u*a-o*c,h=o*l-u*s,d=c*s-a*l,g=t*f+n*h+r*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/g;return e[0]=f*M,e[1]=(r*c-u*n)*M,e[2]=(o*n-r*a)*M,e[3]=h*M,e[4]=(u*t-r*l)*M,e[5]=(r*s-o*t)*M,e[6]=d*M,e[7]=(n*l-c*t)*M,e[8]=(a*t-n*s)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return ri("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(br.makeScale(e,t)),this}rotate(e){return ri("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(br.makeRotation(-e)),this}translate(e,t){return ri("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(br.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const br=new qe,Vs=new qe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zs=new qe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function al(){const i={enabled:!0,workingColorSpace:fr,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===lt&&(r.r=hn(r.r),r.g=hn(r.g),r.b=hn(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===lt&&(r.r=si(r.r),r.g=si(r.g),r.b=si(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===""?dr:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return ri("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return ri("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[fr]:{primaries:e,whitePoint:n,transfer:dr,toXYZ:Vs,fromXYZ:zs,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Gt},outputColorSpaceConfig:{drawingBufferColorSpace:Gt}},[Gt]:{primaries:e,whitePoint:n,transfer:lt,toXYZ:Vs,fromXYZ:zs,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Gt}}}),i}const et=al();function hn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function si(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Gn;class ol{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Gn===void 0&&(Gn=Ci("canvas")),Gn.width=e.width,Gn.height=e.height;const r=Gn.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),n=Gn}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ci("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=hn(s[a]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(hn(t[n]/255)*255):t[n]=hn(t[n]);return{data:t,width:e.width,height:e.height}}else return Oe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let ll=0;class us{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ll++}),this.uuid=In(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Ar(r[a].image)):s.push(Ar(r[a]))}else s=Ar(r);n.url=s}return t||(e.images[this.uuid]=n),n}}function Ar(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?ol.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Oe("Texture: Unable to serialize Texture."),{})}let cl=0;const Rr=new D;class Rt extends Dn{constructor(e=Rt.DEFAULT_IMAGE,t=Rt.DEFAULT_MAPPING,n=1001,r=1001,s=1006,a=1008,o=1023,l=1009,c=Rt.DEFAULT_ANISOTROPY,u=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:cl++}),this.uuid=In(),this.name="",this.source=new us(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new le(0,0),this.repeat=new le(1,1),this.center=new le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Rr).x}get height(){return this.source.getSize(Rr).y}get depth(){return this.source.getSize(Rr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Oe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Oe(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case 1e3:e.x=e.x-Math.floor(e.x);break;case 1001:e.x=e.x<0?0:1;break;case 1002:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case 1e3:e.y=e.y-Math.floor(e.y);break;case 1001:e.y=e.y<0?0:1;break;case 1002:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Rt.DEFAULT_IMAGE=null;Rt.DEFAULT_MAPPING=300;Rt.DEFAULT_ANISOTROPY=1;class dt{static{dt.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s;const l=e.elements,c=l[0],u=l[4],f=l[8],h=l[1],d=l[5],g=l[9],M=l[2],m=l[6],p=l[10];if(Math.abs(u-h)<.01&&Math.abs(f-M)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+M)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const E=(c+1)/2,v=(d+1)/2,R=(p+1)/2,T=(u+h)/4,P=(f+M)/4,_=(g+m)/4;return E>v&&E>R?E<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(E),r=T/n,s=P/n):v>R?v<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(v),n=T/r,s=_/r):R<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(R),n=P/s,r=_/s),this.set(n,r,s,t),this}let y=Math.sqrt((m-g)*(m-g)+(f-M)*(f-M)+(h-u)*(h-u));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(f-M)/y,this.z=(h-u)/y,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this.z=ze(this.z,e.z,t.z),this.w=ze(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this.z=ze(this.z,e,t),this.w=ze(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class hl extends Dn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new dt(0,0,e,t),this.scissorTest=!1,this.viewport=new dt(0,0,e,t),this.textures=[];const r={width:e,height:t,depth:n.depth},s=new Rt(r),a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:1006,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new us(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Kt extends hl{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Za extends Rt{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class ul extends Rt{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ot{static{ot.prototype.isMatrix4=!0}constructor(e,t,n,r,s,a,o,l,c,u,f,h,d,g,M,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c,u,f,h,d,g,M,m)}set(e,t,n,r,s,a,o,l,c,u,f,h,d,g,M,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=r,p[1]=s,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=u,p[10]=f,p[14]=h,p[3]=d,p[7]=g,p[11]=M,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ot().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,r=1/Vn.setFromMatrixColumn(e,0).length(),s=1/Vn.setFromMatrixColumn(e,1).length(),a=1/Vn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,r=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){const h=a*u,d=a*f,g=o*u,M=o*f;t[0]=l*u,t[4]=-l*f,t[8]=c,t[1]=d+g*c,t[5]=h-M*c,t[9]=-o*l,t[2]=M-h*c,t[6]=g+d*c,t[10]=a*l}else if(e.order==="YXZ"){const h=l*u,d=l*f,g=c*u,M=c*f;t[0]=h+M*o,t[4]=g*o-d,t[8]=a*c,t[1]=a*f,t[5]=a*u,t[9]=-o,t[2]=d*o-g,t[6]=M+h*o,t[10]=a*l}else if(e.order==="ZXY"){const h=l*u,d=l*f,g=c*u,M=c*f;t[0]=h-M*o,t[4]=-a*f,t[8]=g+d*o,t[1]=d+g*o,t[5]=a*u,t[9]=M-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const h=a*u,d=a*f,g=o*u,M=o*f;t[0]=l*u,t[4]=g*c-d,t[8]=h*c+M,t[1]=l*f,t[5]=M*c+h,t[9]=d*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const h=a*l,d=a*c,g=o*l,M=o*c;t[0]=l*u,t[4]=M-h*f,t[8]=g*f+d,t[1]=f,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=d*f+g,t[10]=h-M*f}else if(e.order==="XZY"){const h=a*l,d=a*c,g=o*l,M=o*c;t[0]=l*u,t[4]=-f,t[8]=c*u,t[1]=h*f+M,t[5]=a*u,t[9]=d*f-g,t[2]=g*f-d,t[6]=o*u,t[10]=M*f+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(fl,e,dl)}lookAt(e,t,n){const r=this.elements;return Ft.subVectors(e,t),Ft.lengthSq()===0&&(Ft.z=1),Ft.normalize(),_n.crossVectors(n,Ft),_n.lengthSq()===0&&(Math.abs(n.z)===1?Ft.x+=1e-4:Ft.z+=1e-4,Ft.normalize(),_n.crossVectors(n,Ft)),_n.normalize(),Ni.crossVectors(Ft,_n),r[0]=_n.x,r[4]=Ni.x,r[8]=Ft.x,r[1]=_n.y,r[5]=Ni.y,r[9]=Ft.y,r[2]=_n.z,r[6]=Ni.z,r[10]=Ft.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],f=n[5],h=n[9],d=n[13],g=n[2],M=n[6],m=n[10],p=n[14],y=n[3],E=n[7],v=n[11],R=n[15],T=r[0],P=r[4],_=r[8],b=r[12],w=r[1],F=r[5],U=r[9],k=r[13],W=r[2],V=r[6],H=r[10],z=r[14],Q=r[3],se=r[7],ce=r[11],me=r[15];return s[0]=a*T+o*w+l*W+c*Q,s[4]=a*P+o*F+l*V+c*se,s[8]=a*_+o*U+l*H+c*ce,s[12]=a*b+o*k+l*z+c*me,s[1]=u*T+f*w+h*W+d*Q,s[5]=u*P+f*F+h*V+d*se,s[9]=u*_+f*U+h*H+d*ce,s[13]=u*b+f*k+h*z+d*me,s[2]=g*T+M*w+m*W+p*Q,s[6]=g*P+M*F+m*V+p*se,s[10]=g*_+M*U+m*H+p*ce,s[14]=g*b+M*k+m*z+p*me,s[3]=y*T+E*w+v*W+R*Q,s[7]=y*P+E*F+v*V+R*se,s[11]=y*_+E*U+v*H+R*ce,s[15]=y*b+E*k+v*z+R*me,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],f=e[6],h=e[10],d=e[14],g=e[3],M=e[7],m=e[11],p=e[15],y=l*d-c*h,E=o*d-c*f,v=o*h-l*f,R=a*d-c*u,T=a*h-l*u,P=a*f-o*u;return t*(M*y-m*E+p*v)-n*(g*y-m*R+p*T)+r*(g*E-M*R+p*P)-s*(g*v-M*T+m*P)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],r=e[8],s=e[1],a=e[5],o=e[9],l=e[2],c=e[6],u=e[10];return t*(a*u-o*c)-n*(s*u-o*l)+r*(s*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=e[9],h=e[10],d=e[11],g=e[12],M=e[13],m=e[14],p=e[15],y=t*o-n*a,E=t*l-r*a,v=t*c-s*a,R=n*l-r*o,T=n*c-s*o,P=r*c-s*l,_=u*M-f*g,b=u*m-h*g,w=u*p-d*g,F=f*m-h*M,U=f*p-d*M,k=h*p-d*m,W=y*k-E*U+v*F+R*w-T*b+P*_;if(W===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const V=1/W;return e[0]=(o*k-l*U+c*F)*V,e[1]=(r*U-n*k-s*F)*V,e[2]=(M*P-m*T+p*R)*V,e[3]=(h*T-f*P-d*R)*V,e[4]=(l*w-a*k-c*b)*V,e[5]=(t*k-r*w+s*b)*V,e[6]=(m*v-g*P-p*E)*V,e[7]=(u*P-h*v+d*E)*V,e[8]=(a*U-o*w+c*_)*V,e[9]=(n*w-t*U-s*_)*V,e[10]=(g*T-M*v+p*y)*V,e[11]=(f*v-u*T-d*y)*V,e[12]=(o*b-a*F-l*_)*V,e[13]=(t*F-n*b+r*_)*V,e[14]=(M*E-g*R-m*y)*V,e[15]=(u*R-f*E+h*y)*V,this}scale(e){const t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),r=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,u=s*o;return this.set(c*a+n,c*o-r*l,c*l+r*o,0,c*o+r*l,u*o+n,u*l-r*a,0,c*l-r*o,u*l+r*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,a){return this.set(1,n,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){const r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,u=a+a,f=o+o,h=s*c,d=s*u,g=s*f,M=a*u,m=a*f,p=o*f,y=l*c,E=l*u,v=l*f,R=n.x,T=n.y,P=n.z;return r[0]=(1-(M+p))*R,r[1]=(d+v)*R,r[2]=(g-E)*R,r[3]=0,r[4]=(d-v)*T,r[5]=(1-(h+p))*T,r[6]=(m+y)*T,r[7]=0,r[8]=(g+E)*P,r[9]=(m-y)*P,r[10]=(1-(h+M))*P,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let a=Vn.set(r[0],r[1],r[2]).length();const o=Vn.set(r[4],r[5],r[6]).length(),l=Vn.set(r[8],r[9],r[10]).length();s<0&&(a=-a),zt.copy(this);const c=1/a,u=1/o,f=1/l;return zt.elements[0]*=c,zt.elements[1]*=c,zt.elements[2]*=c,zt.elements[4]*=u,zt.elements[5]*=u,zt.elements[6]*=u,zt.elements[8]*=f,zt.elements[9]*=f,zt.elements[10]*=f,t.setFromRotationMatrix(zt),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,r,s,a,o=2e3,l=!1){const c=this.elements,u=2*s/(t-e),f=2*s/(n-r),h=(t+e)/(t-e),d=(n+r)/(n-r);let g,M;if(l)g=s/(a-s),M=a*s/(a-s);else if(o===2e3)g=-(a+s)/(a-s),M=-2*a*s/(a-s);else if(o===2001)g=-a/(a-s),M=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=M,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,s,a,o=2e3,l=!1){const c=this.elements,u=2/(t-e),f=2/(n-r),h=-(t+e)/(t-e),d=-(n+r)/(n-r);let g,M;if(l)g=1/(a-s),M=a/(a-s);else if(o===2e3)g=-2/(a-s),M=-(a+s)/(a-s);else if(o===2001)g=-1/(a-s),M=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=g,c[14]=M,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Vn=new D,zt=new ot,fl=new D(0,0,0),dl=new D(1,1,1),_n=new D,Ni=new D,Ft=new D,Hs=new ot,ks=new ci;class un{constructor(e=0,t=0,n=0,r=un.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],u=r[9],f=r[2],h=r[6],d=r[10];switch(t){case"XYZ":this._y=Math.asin(ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ze(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(ze(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-ze(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ze(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,d),this._y=0);break;default:Oe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Hs.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Hs,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ks.setFromEuler(this),this.setFromQuaternion(ks,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}un.DEFAULT_ORDER="XYZ";class Ja{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let pl=0;const Ws=new D,zn=new ci,en=new ot,Ui=new D,di=new D,ml=new D,gl=new ci,Xs=new D(1,0,0),qs=new D(0,1,0),Ys=new D(0,0,1),Zs={type:"added"},_l={type:"removed"},Hn={type:"childadded",child:null},Cr={type:"childremoved",child:null};class At extends Dn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:pl++}),this.uuid=In(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=At.DEFAULT_UP.clone();const e=new D,t=new un,n=new ci,r=new D(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ot},normalMatrix:{value:new qe}}),this.matrix=new ot,this.matrixWorld=new ot,this.matrixAutoUpdate=At.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=At.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ja,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return zn.setFromAxisAngle(e,t),this.quaternion.multiply(zn),this}rotateOnWorldAxis(e,t){return zn.setFromAxisAngle(e,t),this.quaternion.premultiply(zn),this}rotateX(e){return this.rotateOnAxis(Xs,e)}rotateY(e){return this.rotateOnAxis(qs,e)}rotateZ(e){return this.rotateOnAxis(Ys,e)}translateOnAxis(e,t){return Ws.copy(e).applyQuaternion(this.quaternion),this.position.add(Ws.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Xs,e)}translateY(e){return this.translateOnAxis(qs,e)}translateZ(e){return this.translateOnAxis(Ys,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(en.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ui.copy(e):Ui.set(e,t,n);const r=this.parent;this.updateWorldMatrix(!0,!1),di.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?en.lookAt(di,Ui,this.up):en.lookAt(Ui,di,this.up),this.quaternion.setFromRotationMatrix(en),r&&(en.extractRotation(r.matrixWorld),zn.setFromRotationMatrix(en),this.quaternion.premultiply(zn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(je("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Zs),Hn.child=e,this.dispatchEvent(Hn),Hn.child=null):je("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(_l),Cr.child=e,this.dispatchEvent(Cr),Cr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),en.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),en.multiply(e.parent.matrixWorld)),e.applyMatrix4(en),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Zs),Hn.child=e,this.dispatchEvent(Hn),Hn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(di,e,ml),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(di,gl,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,r=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*r,s[13]+=n-s[1]*t-s[5]*n-s[9]*r,s[14]+=r-s[2]*t-s[6]*n-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];s(e.shapes,f)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),f=a(e.shapes),h=a(e.skeletons),d=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),h.length>0&&(n.skeletons=h),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=r,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const r=e.children[n];this.add(r.clone())}return this}}At.DEFAULT_UP=new D(0,1,0);At.DEFAULT_MATRIX_AUTO_UPDATE=!0;At.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Oi extends At{constructor(){super(),this.isGroup=!0,this.type="Group"}}const vl={type:"move"};class wr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Oi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Oi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Oi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const M of e.hand.values()){const m=t.getJointPose(M,n),p=this._getHandJoint(c,M);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=u.position.distanceTo(f.position),d=.02,g=.005;c.inputState.pinching&&h>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(vl)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Oi;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Ka={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},vn={h:0,s:0,l:0},Bi={h:0,s:0,l:0};function Pr(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Ye{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Gt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,et.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=et.workingColorSpace){return this.r=e,this.g=t,this.b=n,et.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=et.workingColorSpace){if(e=hs(e,1),t=ze(t,0,1),n=ze(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=Pr(a,s,e+1/3),this.g=Pr(a,s,e),this.b=Pr(a,s,e-1/3)}return et.colorSpaceToWorking(this,r),this}setStyle(e,t=Gt){function n(s){s!==void 0&&parseFloat(s)<1&&Oe("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Oe("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);Oe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Gt){const n=Ka[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Oe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=hn(e.r),this.g=hn(e.g),this.b=hn(e.b),this}copyLinearToSRGB(e){return this.r=si(e.r),this.g=si(e.g),this.b=si(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Gt){return et.workingToColorSpace(wt.copy(this),e),Math.round(ze(wt.r*255,0,255))*65536+Math.round(ze(wt.g*255,0,255))*256+Math.round(ze(wt.b*255,0,255))}getHexString(e=Gt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=et.workingColorSpace){et.workingToColorSpace(wt.copy(this),t);const n=wt.r,r=wt.g,s=wt.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=u<=.5?f/(a+o):f/(2-a-o),a){case n:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-n)/f+2;break;case s:l=(n-r)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=et.workingColorSpace){return et.workingToColorSpace(wt.copy(this),t),e.r=wt.r,e.g=wt.g,e.b=wt.b,e}getStyle(e=Gt){et.workingToColorSpace(wt.copy(this),e);const t=wt.r,n=wt.g,r=wt.b;return e!==Gt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(vn),this.setHSL(vn.h+e,vn.s+t,vn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(vn),e.getHSL(Bi);const n=bi(vn.h,Bi.h,t),r=bi(vn.s,Bi.s,t),s=bi(vn.l,Bi.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const wt=new Ye;Ye.NAMES=Ka;class ym extends At{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new un,this.environmentIntensity=1,this.environmentRotation=new un,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Ht=new D,tn=new D,Lr=new D,nn=new D,kn=new D,Wn=new D,Js=new D,Dr=new D,Ir=new D,Fr=new D,Nr=new dt,Ur=new dt,Or=new dt;class Wt{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Ht.subVectors(e,t),r.cross(Ht);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){Ht.subVectors(r,t),tn.subVectors(n,t),Lr.subVectors(e,t);const a=Ht.dot(Ht),o=Ht.dot(tn),l=Ht.dot(Lr),c=tn.dot(tn),u=tn.dot(Lr),f=a*c-o*o;if(f===0)return s.set(0,0,0),null;const h=1/f,d=(c*l-o*u)*h,g=(a*u-o*l)*h;return s.set(1-d-g,g,d)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,nn)===null?!1:nn.x>=0&&nn.y>=0&&nn.x+nn.y<=1}static getInterpolation(e,t,n,r,s,a,o,l){return this.getBarycoord(e,t,n,r,nn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,nn.x),l.addScaledVector(a,nn.y),l.addScaledVector(o,nn.z),l)}static getInterpolatedAttribute(e,t,n,r,s,a){return Nr.setScalar(0),Ur.setScalar(0),Or.setScalar(0),Nr.fromBufferAttribute(e,t),Ur.fromBufferAttribute(e,n),Or.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Nr,s.x),a.addScaledVector(Ur,s.y),a.addScaledVector(Or,s.z),a}static isFrontFacing(e,t,n,r){return Ht.subVectors(n,t),tn.subVectors(e,t),Ht.cross(tn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ht.subVectors(this.c,this.b),tn.subVectors(this.a,this.b),Ht.cross(tn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Wt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Wt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return Wt.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return Wt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Wt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,r=this.b,s=this.c;let a,o;kn.subVectors(r,n),Wn.subVectors(s,n),Dr.subVectors(e,n);const l=kn.dot(Dr),c=Wn.dot(Dr);if(l<=0&&c<=0)return t.copy(n);Ir.subVectors(e,r);const u=kn.dot(Ir),f=Wn.dot(Ir);if(u>=0&&f<=u)return t.copy(r);const h=l*f-u*c;if(h<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(kn,a);Fr.subVectors(e,s);const d=kn.dot(Fr),g=Wn.dot(Fr);if(g>=0&&d<=g)return t.copy(s);const M=d*c-l*g;if(M<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(Wn,o);const m=u*g-d*f;if(m<=0&&f-u>=0&&d-g>=0)return Js.subVectors(s,r),o=(f-u)/(f-u+(d-g)),t.copy(r).addScaledVector(Js,o);const p=1/(m+M+h);return a=M*p,o=h*p,t.copy(n).addScaledVector(kn,a).addScaledVector(Wn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Fn{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(kt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(kt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=kt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,kt):kt.fromBufferAttribute(s,a),kt.applyMatrix4(e.matrixWorld),this.expandByPoint(kt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Gi.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Gi.copy(n.boundingBox)),Gi.applyMatrix4(e.matrixWorld),this.union(Gi)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,kt),kt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(pi),Vi.subVectors(this.max,pi),Xn.subVectors(e.a,pi),qn.subVectors(e.b,pi),Yn.subVectors(e.c,pi),xn.subVectors(qn,Xn),Sn.subVectors(Yn,qn),bn.subVectors(Xn,Yn);let t=[0,-xn.z,xn.y,0,-Sn.z,Sn.y,0,-bn.z,bn.y,xn.z,0,-xn.x,Sn.z,0,-Sn.x,bn.z,0,-bn.x,-xn.y,xn.x,0,-Sn.y,Sn.x,0,-bn.y,bn.x,0];return!Br(t,Xn,qn,Yn,Vi)||(t=[1,0,0,0,1,0,0,0,1],!Br(t,Xn,qn,Yn,Vi))?!1:(zi.crossVectors(xn,Sn),t=[zi.x,zi.y,zi.z],Br(t,Xn,qn,Yn,Vi))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,kt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(kt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(rn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),rn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),rn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),rn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),rn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),rn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),rn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),rn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(rn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const rn=[new D,new D,new D,new D,new D,new D,new D,new D],kt=new D,Gi=new Fn,Xn=new D,qn=new D,Yn=new D,xn=new D,Sn=new D,bn=new D,pi=new D,Vi=new D,zi=new D,An=new D;function Br(i,e,t,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){An.fromArray(i,s);const o=r.x*Math.abs(An.x)+r.y*Math.abs(An.y)+r.z*Math.abs(An.z),l=e.dot(An),c=t.dot(An),u=n.dot(An);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const on=xl();function xl(){const i=new ArrayBuffer(4),e=new Float32Array(i),t=new Uint32Array(i),n=new Uint32Array(512),r=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(n[l]=0,n[l|256]=32768,r[l]=24,r[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,r[l]=-c-1,r[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,r[l]=13,r[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,r[l]=24,r[l|256]=24):(n[l]=31744,n[l|256]=64512,r[l]=13,r[l|256]=13)}const s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,u=0;for(;(c&8388608)===0;)c<<=1,u-=8388608;c&=-8388609,u+=947912704,s[l]=c|u}for(let l=1024;l<2048;++l)s[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:r,mantissaTable:s,exponentTable:a,offsetTable:o}}function Sl(i){Math.abs(i)>65504&&Oe("DataUtils.toHalfFloat(): Value out of range."),i=ze(i,-65504,65504),on.floatView[0]=i;const e=on.uint32View[0],t=e>>23&511;return on.baseTable[t]+((e&8388607)>>on.shiftTable[t])}function Ml(i){const e=i>>10;return on.uint32View[0]=on.mantissaTable[on.offsetTable[e]+(i&1023)]+on.exponentTable[e],on.floatView[0]}class Em{static toHalfFloat(e){return Sl(e)}static fromHalfFloat(e){return Ml(e)}}const St=new D,Hi=new le;let yl=0;class Xt extends Dn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:yl++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=35044,this.updateRanges=[],this.gpuType=1015,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Hi.fromBufferAttribute(this,t),Hi.applyMatrix3(e),this.setXY(t,Hi.x,Hi.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)St.fromBufferAttribute(this,t),St.applyMatrix3(e),this.setXYZ(t,St.x,St.y,St.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)St.fromBufferAttribute(this,t),St.applyMatrix4(e),this.setXYZ(t,St.x,St.y,St.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)St.fromBufferAttribute(this,t),St.applyNormalMatrix(e),this.setXYZ(t,St.x,St.y,St.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)St.fromBufferAttribute(this,t),St.transformDirection(e),this.setXYZ(t,St.x,St.y,St.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=ni(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Pt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ni(t,this.array)),t}setX(e,t){return this.normalized&&(t=Pt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ni(t,this.array)),t}setY(e,t){return this.normalized&&(t=Pt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ni(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Pt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ni(t,this.array)),t}setW(e,t){return this.normalized&&(t=Pt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Pt(t,this.array),n=Pt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Pt(t,this.array),n=Pt(n,this.array),r=Pt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=Pt(t,this.array),n=Pt(n,this.array),r=Pt(r,this.array),s=Pt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class $a extends Xt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Qa extends Xt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class $e extends Xt{constructor(e,t,n){super(new Float32Array(e),t,n)}}const El=new Fn,mi=new D,Gr=new D;class Nn{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):El.setFromPoints(e).getCenter(n);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;mi.subVectors(e,this.center);const t=mi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(mi,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Gr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(mi.copy(e.center).add(Gr)),this.expandByPoint(mi.copy(e.center).sub(Gr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Tl=0;const Bt=new ot,Vr=new At,Zn=new D,Nt=new Fn,gi=new Fn,bt=new D;class Mt extends Dn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Tl++}),this.uuid=In(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Vo(e)?Qa:$a)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new qe().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Bt.makeRotationFromQuaternion(e),this.applyMatrix4(Bt),this}rotateX(e){return Bt.makeRotationX(e),this.applyMatrix4(Bt),this}rotateY(e){return Bt.makeRotationY(e),this.applyMatrix4(Bt),this}rotateZ(e){return Bt.makeRotationZ(e),this.applyMatrix4(Bt),this}translate(e,t,n){return Bt.makeTranslation(e,t,n),this.applyMatrix4(Bt),this}scale(e,t,n){return Bt.makeScale(e,t,n),this.applyMatrix4(Bt),this}lookAt(e){return Vr.lookAt(e),Vr.updateMatrix(),this.applyMatrix4(Vr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Zn).negate(),this.translate(Zn.x,Zn.y,Zn.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new $e(n,3))}else{const n=Math.min(e.length,t.count);for(let r=0;r<n;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&Oe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Fn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){je("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){const s=t[n];Nt.setFromBufferAttribute(s),this.morphTargetsRelative?(bt.addVectors(this.boundingBox.min,Nt.min),this.boundingBox.expandByPoint(bt),bt.addVectors(this.boundingBox.max,Nt.max),this.boundingBox.expandByPoint(bt)):(this.boundingBox.expandByPoint(Nt.min),this.boundingBox.expandByPoint(Nt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&je('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Nn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){je("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const n=this.boundingSphere.center;if(Nt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];gi.setFromBufferAttribute(o),this.morphTargetsRelative?(bt.addVectors(Nt.min,gi.min),Nt.expandByPoint(bt),bt.addVectors(Nt.max,gi.max),Nt.expandByPoint(bt)):(Nt.expandByPoint(gi.min),Nt.expandByPoint(gi.max))}Nt.getCenter(n);let r=0;for(let s=0,a=e.count;s<a;s++)bt.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(bt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)bt.fromBufferAttribute(o,c),l&&(Zn.fromBufferAttribute(e,c),bt.add(Zn)),r=Math.max(r,n.distanceToSquared(bt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&je('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){je("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,r=t.normal,s=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Xt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let _=0;_<n.count;_++)o[_]=new D,l[_]=new D;const c=new D,u=new D,f=new D,h=new le,d=new le,g=new le,M=new D,m=new D;function p(_,b,w){c.fromBufferAttribute(n,_),u.fromBufferAttribute(n,b),f.fromBufferAttribute(n,w),h.fromBufferAttribute(s,_),d.fromBufferAttribute(s,b),g.fromBufferAttribute(s,w),u.sub(c),f.sub(c),d.sub(h),g.sub(h);const F=1/(d.x*g.y-g.x*d.y);isFinite(F)&&(M.copy(u).multiplyScalar(g.y).addScaledVector(f,-d.y).multiplyScalar(F),m.copy(f).multiplyScalar(d.x).addScaledVector(u,-g.x).multiplyScalar(F),o[_].add(M),o[b].add(M),o[w].add(M),l[_].add(m),l[b].add(m),l[w].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let _=0,b=y.length;_<b;++_){const w=y[_],F=w.start,U=w.count;for(let k=F,W=F+U;k<W;k+=3)p(e.getX(k+0),e.getX(k+1),e.getX(k+2))}const E=new D,v=new D,R=new D,T=new D;function P(_){R.fromBufferAttribute(r,_),T.copy(R);const b=o[_];E.copy(b),E.sub(R.multiplyScalar(R.dot(b))).normalize(),v.crossVectors(T,b);const F=v.dot(l[_])<0?-1:1;a.setXYZW(_,E.x,E.y,E.z,F)}for(let _=0,b=y.length;_<b;++_){const w=y[_],F=w.start,U=w.count;for(let k=F,W=F+U;k<W;k+=3)P(e.getX(k+0)),P(e.getX(k+1)),P(e.getX(k+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Xt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,d=n.count;h<d;h++)n.setXYZ(h,0,0,0);const r=new D,s=new D,a=new D,o=new D,l=new D,c=new D,u=new D,f=new D;if(e)for(let h=0,d=e.count;h<d;h+=3){const g=e.getX(h+0),M=e.getX(h+1),m=e.getX(h+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,M),a.fromBufferAttribute(t,m),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,M),c.fromBufferAttribute(n,m),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(M,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,d=t.count;h<d;h+=3)r.fromBufferAttribute(t,h+0),s.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)bt.fromBufferAttribute(e,t),bt.normalize(),e.setXYZ(t,bt.x,bt.y,bt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,f=o.normalized,h=new c.constructor(l.length*u);let d=0,g=0;for(let M=0,m=l.length;M<m;M++){o.isInterleavedBufferAttribute?d=l[M]*o.data.stride+o.offset:d=l[M]*u;for(let p=0;p<u;p++)h[g++]=c[d++]}return new Xt(h,u,f)}if(this.index===null)return Oe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Mt,n=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,n);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let u=0,f=c.length;u<f;u++){const h=c[u],d=e(h,n);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,h=c.length;f<h;f++){const d=c[f];u.push(d.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],f=s[c];for(let h=0,d=f.length;h<d;h++)u.push(f[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let bl=0;class fn extends Dn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:bl++}),this.uuid=In(),this.name="",this.type="Material",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ye(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Oe(`Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Oe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ye().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new le().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new le().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const sn=new D,zr=new D,ki=new D,Mn=new D,Hr=new D,Wi=new D,kr=new D;class fs{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,sn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=sn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(sn.copy(this.origin).addScaledVector(this.direction,t),sn.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){zr.copy(e).add(t).multiplyScalar(.5),ki.copy(t).sub(e).normalize(),Mn.copy(this.origin).sub(zr);const s=e.distanceTo(t)*.5,a=-this.direction.dot(ki),o=Mn.dot(this.direction),l=-Mn.dot(ki),c=Mn.lengthSq(),u=Math.abs(1-a*a);let f,h,d,g;if(u>0)if(f=a*l-o,h=a*o-l,g=s*u,f>=0)if(h>=-g)if(h<=g){const M=1/u;f*=M,h*=M,d=f*(f+a*h+2*o)+h*(a*f+h+2*l)+c}else h=s,f=Math.max(0,-(a*h+o)),d=-f*f+h*(h+2*l)+c;else h=-s,f=Math.max(0,-(a*h+o)),d=-f*f+h*(h+2*l)+c;else h<=-g?(f=Math.max(0,-(-a*s+o)),h=f>0?-s:Math.min(Math.max(-s,-l),s),d=-f*f+h*(h+2*l)+c):h<=g?(f=0,h=Math.min(Math.max(-s,-l),s),d=h*(h+2*l)+c):(f=Math.max(0,-(a*s+o)),h=f>0?s:Math.min(Math.max(-s,-l),s),d=-f*f+h*(h+2*l)+c);else h=a>0?-s:s,f=Math.max(0,-(a*h+o)),d=-f*f+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(zr).addScaledVector(ki,h),d}intersectSphere(e,t){sn.subVectors(e.center,this.origin);const n=sn.dot(this.direction),r=sn.dot(sn)-n*n,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),u>=0?(s=(e.min.y-h.y)*u,a=(e.max.y-h.y)*u):(s=(e.max.y-h.y)*u,a=(e.min.y-h.y)*u),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),f>=0?(o=(e.min.z-h.z)*f,l=(e.max.z-h.z)*f):(o=(e.max.z-h.z)*f,l=(e.min.z-h.z)*f),n>l||o>r)||((o>n||n!==n)&&(n=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,sn)!==null}intersectTriangle(e,t,n,r,s){Hr.subVectors(t,e),Wi.subVectors(n,e),kr.crossVectors(Hr,Wi);let a=this.direction.dot(kr),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Mn.subVectors(this.origin,e);const l=o*this.direction.dot(Wi.crossVectors(Mn,Wi));if(l<0)return null;const c=o*this.direction.dot(Hr.cross(Mn));if(c<0||l+c>a)return null;const u=-o*Mn.dot(kr);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ii extends fn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ye(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new un,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ks=new ot,Rn=new fs,Xi=new Nn,$s=new D,qi=new D,Yi=new D,Zi=new D,Wr=new D,Ji=new D,Qs=new D,Ki=new D;class Dt extends At{constructor(e=new Mt,t=new ii){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Ji.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=o[l],f=s[l];u!==0&&(Wr.fromBufferAttribute(f,e),a?Ji.addScaledVector(Wr,u):Ji.addScaledVector(Wr.sub(t),u))}t.add(Ji)}return t}raycast(e,t){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Xi.copy(n.boundingSphere),Xi.applyMatrix4(s),Rn.copy(e.ray).recast(e.near),!(Xi.containsPoint(Rn.origin)===!1&&(Rn.intersectSphere(Xi,$s)===null||Rn.origin.distanceToSquared($s)>(e.far-e.near)**2))&&(Ks.copy(s).invert(),Rn.copy(e.ray).applyMatrix4(Ks),!(n.boundingBox!==null&&Rn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Rn)))}_computeIntersections(e,t,n){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,h=s.groups,d=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,M=h.length;g<M;g++){const m=h[g],p=a[m.materialIndex],y=Math.max(m.start,d.start),E=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let v=y,R=E;v<R;v+=3){const T=o.getX(v),P=o.getX(v+1),_=o.getX(v+2);r=$i(this,p,e,n,c,u,f,T,P,_),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,d.start),M=Math.min(o.count,d.start+d.count);for(let m=g,p=M;m<p;m+=3){const y=o.getX(m),E=o.getX(m+1),v=o.getX(m+2);r=$i(this,a,e,n,c,u,f,y,E,v),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,M=h.length;g<M;g++){const m=h[g],p=a[m.materialIndex],y=Math.max(m.start,d.start),E=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let v=y,R=E;v<R;v+=3){const T=v,P=v+1,_=v+2;r=$i(this,p,e,n,c,u,f,T,P,_),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,d.start),M=Math.min(l.count,d.start+d.count);for(let m=g,p=M;m<p;m+=3){const y=m,E=m+1,v=m+2;r=$i(this,a,e,n,c,u,f,y,E,v),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function Al(i,e,t,n,r,s,a,o){let l;if(e.side===1?l=n.intersectTriangle(a,s,r,!0,o):l=n.intersectTriangle(r,s,a,e.side===0,o),l===null)return null;Ki.copy(o),Ki.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Ki);return c<t.near||c>t.far?null:{distance:c,point:Ki.clone(),object:i}}function $i(i,e,t,n,r,s,a,o,l,c){i.getVertexPosition(o,qi),i.getVertexPosition(l,Yi),i.getVertexPosition(c,Zi);const u=Al(i,e,t,n,qi,Yi,Zi,Qs);if(u){const f=new D;Wt.getBarycoord(Qs,qi,Yi,Zi,f),r&&(u.uv=Wt.getInterpolatedAttribute(r,o,l,c,f,new le)),s&&(u.uv1=Wt.getInterpolatedAttribute(s,o,l,c,f,new le)),a&&(u.normal=Wt.getInterpolatedAttribute(a,o,l,c,f,new D),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new D,materialIndex:0};Wt.getNormal(qi,Yi,Zi,h.normal),u.face=h,u.barycoord=f}return u}class pr extends Rt{constructor(e=null,t=1,n=1,r,s,a,o,l,c=1003,u=1003,f,h){super(null,a,o,l,c,u,r,s,f,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class js extends Xt{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Jn=new ot,ea=new ot,Qi=[],ta=new Fn,Rl=new ot,_i=new Dt,vi=new Nn;class Tm extends Dt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new js(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<n;r++)this.setMatrixAt(r,Rl)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Fn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Jn),ta.copy(e.boundingBox).applyMatrix4(Jn),this.boundingBox.union(ta)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Nn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Jn),vi.copy(e.boundingSphere).applyMatrix4(Jn),this.boundingSphere.union(vi)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,s=n.length+1,a=e*s+1;for(let o=0;o<n.length;o++)n[o]=r[a+o]}raycast(e,t){const n=this.matrixWorld,r=this.count;if(_i.geometry=this.geometry,_i.material=this.material,_i.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),vi.copy(this.boundingSphere),vi.applyMatrix4(n),e.ray.intersectsSphere(vi)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,Jn),ea.multiplyMatrices(n,Jn),_i.matrixWorld=ea,_i.raycast(e,Qi);for(let a=0,o=Qi.length;a<o;a++){const l=Qi[a];l.instanceId=s,l.object=this,t.push(l)}Qi.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new js(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new pr(new Float32Array(r*this.count),r,this.count,1028,1015));const s=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=r*e;return s[l]=o,s.set(n,l+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Xr=new D,Cl=new D,wl=new qe;class wn{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const r=Xr.subVectors(n,t).cross(Cl.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const r=e.delta(Xr),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||wl.getNormalMatrix(e),r=this.coplanarPoint(Xr).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Cn=new Nn,Pl=new le(.5,.5),ji=new D;class ds{constructor(e=new wn,t=new wn,n=new wn,r=new wn,s=new wn,a=new wn){this.planes=[e,t,n,r,s,a]}set(e,t,n,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=2e3,n=!1){const r=this.planes,s=e.elements,a=s[0],o=s[1],l=s[2],c=s[3],u=s[4],f=s[5],h=s[6],d=s[7],g=s[8],M=s[9],m=s[10],p=s[11],y=s[12],E=s[13],v=s[14],R=s[15];if(r[0].setComponents(c-a,d-u,p-g,R-y).normalize(),r[1].setComponents(c+a,d+u,p+g,R+y).normalize(),r[2].setComponents(c+o,d+f,p+M,R+E).normalize(),r[3].setComponents(c-o,d-f,p-M,R-E).normalize(),n)r[4].setComponents(l,h,m,v).normalize(),r[5].setComponents(c-l,d-h,p-m,R-v).normalize();else if(r[4].setComponents(c-l,d-h,p-m,R-v).normalize(),t===2e3)r[5].setComponents(c+l,d+h,p+m,R+v).normalize();else if(t===2001)r[5].setComponents(l,h,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Cn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Cn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Cn)}intersectsSprite(e){Cn.center.set(0,0,0);const t=Pl.distanceTo(e.center);return Cn.radius=.7071067811865476+t,Cn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Cn)}intersectsSphere(e){const t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const r=t[n];if(ji.x=r.normal.x>0?e.max.x:e.min.x,ji.y=r.normal.y>0?e.max.y:e.min.y,ji.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ji)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ll extends fn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ye(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const mr=new D,gr=new D,na=new ot,xi=new fs,er=new Nn,qr=new D,ia=new D;class Dl extends At{constructor(e=new Mt,t=new Ll){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let r=1,s=t.count;r<s;r++)mr.fromBufferAttribute(t,r-1),gr.fromBufferAttribute(t,r),n[r]=n[r-1],n[r]+=mr.distanceTo(gr);e.setAttribute("lineDistance",new $e(n,1))}else Oe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),er.copy(n.boundingSphere),er.applyMatrix4(r),er.radius+=s,e.ray.intersectsSphere(er)===!1)return;na.copy(r).invert(),xi.copy(e.ray).applyMatrix4(na);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){const d=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let M=d,m=g-1;M<m;M+=c){const p=u.getX(M),y=u.getX(M+1),E=tr(this,e,xi,l,p,y,M);E&&t.push(E)}if(this.isLineLoop){const M=u.getX(g-1),m=u.getX(d),p=tr(this,e,xi,l,M,m,g-1);p&&t.push(p)}}else{const d=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let M=d,m=g-1;M<m;M+=c){const p=tr(this,e,xi,l,M,M+1,M);p&&t.push(p)}if(this.isLineLoop){const M=tr(this,e,xi,l,g-1,d,g-1);M&&t.push(M)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function tr(i,e,t,n,r,s,a){const o=i.geometry.attributes.position;if(mr.fromBufferAttribute(o,r),gr.fromBufferAttribute(o,s),t.distanceSqToSegment(mr,gr,qr,ia)>n)return;qr.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(qr);if(!(c<e.near||c>e.far))return{distance:c,point:ia.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}const ra=new D,sa=new D;class bm extends Dl{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let r=0,s=t.count;r<s;r+=2)ra.fromBufferAttribute(t,r),sa.fromBufferAttribute(t,r+1),n[r]=r===0?0:n[r-1],n[r+1]=n[r]+ra.distanceTo(sa);e.setAttribute("lineDistance",new $e(n,1))}else Oe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Il extends fn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ye(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const aa=new ot,ss=new fs,nr=new Nn,ir=new D;class Am extends At{constructor(e=new Mt,t=new Il){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),nr.copy(n.boundingSphere),nr.applyMatrix4(r),nr.radius+=s,e.ray.intersectsSphere(nr)===!1)return;aa.copy(r).invert(),ss.copy(e.ray).applyMatrix4(aa);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,f=n.attributes.position;if(c!==null){const h=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let g=h,M=d;g<M;g++){const m=c.getX(g);ir.fromBufferAttribute(f,m),oa(ir,m,l,r,e,t,this)}}else{const h=Math.max(0,a.start),d=Math.min(f.count,a.start+a.count);for(let g=h,M=d;g<M;g++)ir.fromBufferAttribute(f,g),oa(ir,g,l,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function oa(i,e,t,n,r,s,a){const o=ss.distanceSqToPoint(i);if(o<t){const l=new D;ss.closestPointToPoint(i,l),l.applyMatrix4(n);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class ja extends Rt{constructor(e=[],t=301,n,r,s,a,o,l,c,u){super(e,t,n,r,s,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Rm extends Rt{constructor(e,t,n,r,s,a,o,l,c){super(e,t,n,r,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ai extends Rt{constructor(e,t,n=1014,r,s,a,o=1003,l=1003,c,u=1026,f=1){if(u!==1026&&u!==1027)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:t,depth:f};super(h,r,s,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new us(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Fl extends ai{constructor(e,t=1014,n=301,r,s,a=1003,o=1003,l,c=1026){const u={width:e,height:e,depth:1},f=[u,u,u,u,u,u];super(e,e,t,n,r,s,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class eo extends Rt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Ii extends Mt{constructor(e=1,t=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],u=[],f=[];let h=0,d=0;g("z","y","x",-1,-1,n,t,e,a,s,0),g("z","y","x",1,-1,n,t,-e,a,s,1),g("x","z","y",1,1,e,n,t,r,a,2),g("x","z","y",1,-1,e,n,-t,r,a,3),g("x","y","z",1,-1,e,t,n,r,s,4),g("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new $e(c,3)),this.setAttribute("normal",new $e(u,3)),this.setAttribute("uv",new $e(f,2));function g(M,m,p,y,E,v,R,T,P,_,b){const w=v/P,F=R/_,U=v/2,k=R/2,W=T/2,V=P+1,H=_+1;let z=0,Q=0;const se=new D;for(let ce=0;ce<H;ce++){const me=ce*F-k;for(let Re=0;Re<V;Re++){const Qe=Re*w-U;se[M]=Qe*y,se[m]=me*E,se[p]=W,c.push(se.x,se.y,se.z),se[M]=0,se[m]=0,se[p]=T>0?1:-1,u.push(se.x,se.y,se.z),f.push(Re/P),f.push(1-ce/_),z+=1}}for(let ce=0;ce<_;ce++)for(let me=0;me<P;me++){const Re=h+me+V*ce,Qe=h+me+V*(ce+1),st=h+(me+1)+V*(ce+1),it=h+(me+1)+V*ce;l.push(Re,Qe,it),l.push(Qe,st,it),Q+=6}o.addGroup(d,Q,b),d+=Q,h+=z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ii(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class to extends Mt{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);const s=[],a=[],o=[],l=[],c=new D,u=new le;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,h=3;f<=t;f++,h+=3){const d=n+f/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(a[h]/e+1)/2,u.y=(a[h+1]/e+1)/2,l.push(u.x,u.y)}for(let f=1;f<=t;f++)s.push(f,f+1,0);this.setIndex(s),this.setAttribute("position",new $e(a,3)),this.setAttribute("normal",new $e(o,3)),this.setAttribute("uv",new $e(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new to(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class no extends Mt{constructor(e=1,t=1,n=1,r=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const u=[],f=[],h=[],d=[];let g=0;const M=[],m=n/2;let p=0;y(),a===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(u),this.setAttribute("position",new $e(f,3)),this.setAttribute("normal",new $e(h,3)),this.setAttribute("uv",new $e(d,2));function y(){const v=new D,R=new D;let T=0;const P=(t-e)/n;for(let _=0;_<=s;_++){const b=[],w=_/s,F=w*(t-e)+e;for(let U=0;U<=r;U++){const k=U/r,W=k*l+o,V=Math.sin(W),H=Math.cos(W);R.x=F*V,R.y=-w*n+m,R.z=F*H,f.push(R.x,R.y,R.z),v.set(V,P,H).normalize(),h.push(v.x,v.y,v.z),d.push(k,1-w),b.push(g++)}M.push(b)}for(let _=0;_<r;_++)for(let b=0;b<s;b++){const w=M[b][_],F=M[b+1][_],U=M[b+1][_+1],k=M[b][_+1];(e>0||b!==0)&&(u.push(w,F,k),T+=3),(t>0||b!==s-1)&&(u.push(F,U,k),T+=3)}c.addGroup(p,T,0),p+=T}function E(v){const R=g,T=new le,P=new D;let _=0;const b=v===!0?e:t,w=v===!0?1:-1;for(let U=1;U<=r;U++)f.push(0,m*w,0),h.push(0,w,0),d.push(.5,.5),g++;const F=g;for(let U=0;U<=r;U++){const W=U/r*l+o,V=Math.cos(W),H=Math.sin(W);P.x=b*H,P.y=m*w,P.z=b*V,f.push(P.x,P.y,P.z),h.push(0,w,0),T.x=V*.5+.5,T.y=H*.5*w+.5,d.push(T.x,T.y),g++}for(let U=0;U<r;U++){const k=R+U,W=F+U;v===!0?u.push(W,W+1,k):u.push(W+1,W,k),_+=3}c.addGroup(p,_,v===!0?1:2),p+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new no(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ps extends Mt{constructor(e=[],t=[],n=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:r};const s=[],a=[];o(r),c(n),u(),this.setAttribute("position",new $e(s,3)),this.setAttribute("normal",new $e(s.slice(),3)),this.setAttribute("uv",new $e(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(y){const E=new D,v=new D,R=new D;for(let T=0;T<t.length;T+=3)d(t[T+0],E),d(t[T+1],v),d(t[T+2],R),l(E,v,R,y)}function l(y,E,v,R){const T=R+1,P=[];for(let _=0;_<=T;_++){P[_]=[];const b=y.clone().lerp(v,_/T),w=E.clone().lerp(v,_/T),F=T-_;for(let U=0;U<=F;U++)U===0&&_===T?P[_][U]=b:P[_][U]=b.clone().lerp(w,U/F)}for(let _=0;_<T;_++)for(let b=0;b<2*(T-_)-1;b++){const w=Math.floor(b/2);b%2===0?(h(P[_][w+1]),h(P[_+1][w]),h(P[_][w])):(h(P[_][w+1]),h(P[_+1][w+1]),h(P[_+1][w]))}}function c(y){const E=new D;for(let v=0;v<s.length;v+=3)E.x=s[v+0],E.y=s[v+1],E.z=s[v+2],E.normalize().multiplyScalar(y),s[v+0]=E.x,s[v+1]=E.y,s[v+2]=E.z}function u(){const y=new D;for(let E=0;E<s.length;E+=3){y.x=s[E+0],y.y=s[E+1],y.z=s[E+2];const v=m(y)/2/Math.PI+.5,R=p(y)/Math.PI+.5;a.push(v,1-R)}g(),f()}function f(){for(let y=0;y<a.length;y+=6){const E=a[y+0],v=a[y+2],R=a[y+4],T=Math.max(E,v,R),P=Math.min(E,v,R);T>.9&&P<.1&&(E<.2&&(a[y+0]+=1),v<.2&&(a[y+2]+=1),R<.2&&(a[y+4]+=1))}}function h(y){s.push(y.x,y.y,y.z)}function d(y,E){const v=y*3;E.x=e[v+0],E.y=e[v+1],E.z=e[v+2]}function g(){const y=new D,E=new D,v=new D,R=new D,T=new le,P=new le,_=new le;for(let b=0,w=0;b<s.length;b+=9,w+=6){y.set(s[b+0],s[b+1],s[b+2]),E.set(s[b+3],s[b+4],s[b+5]),v.set(s[b+6],s[b+7],s[b+8]),T.set(a[w+0],a[w+1]),P.set(a[w+2],a[w+3]),_.set(a[w+4],a[w+5]),R.copy(y).add(E).add(v).divideScalar(3);const F=m(R);M(T,w+0,y,F),M(P,w+2,E,F),M(_,w+4,v,F)}}function M(y,E,v,R){R<0&&y.x===1&&(a[E]=y.x-1),v.x===0&&v.z===0&&(a[E]=R/2/Math.PI+.5)}function m(y){return Math.atan2(y.z,-y.x)}function p(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ps(e.vertices,e.indices,e.radius,e.detail)}}class Qt{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Oe("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,r=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),s+=n.distanceTo(r),t.push(s),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let r=0;const s=n.length;let a;t?a=t:a=e*n[s-1];let o=0,l=s-1,c;for(;o<=l;)if(r=Math.floor(o+(l-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,n[r]===a)return r/(s-1);const u=n[r],h=n[r+1]-u,d=(a-u)/h;return(r+d)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);const a=this.getPoint(r),o=this.getPoint(s),l=t||(a.isVector2?new le:new D);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new D,r=[],s=[],a=[],o=new D,l=new ot;for(let d=0;d<=e;d++){const g=d/e;r[d]=this.getTangentAt(g,new D)}s[0]=new D,a[0]=new D;let c=Number.MAX_VALUE;const u=Math.abs(r[0].x),f=Math.abs(r[0].y),h=Math.abs(r[0].z);u<=c&&(c=u,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),h<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let d=1;d<=e;d++){if(s[d]=s[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(r[d-1],r[d]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(ze(r[d-1].dot(r[d]),-1,1));s[d].applyMatrix4(l.makeRotationAxis(o,g))}a[d].crossVectors(r[d],s[d])}if(t===!0){let d=Math.acos(ze(s[0].dot(s[e]),-1,1));d/=e,r[0].dot(o.crossVectors(s[0],s[e]))>0&&(d=-d);for(let g=1;g<=e;g++)s[g].applyMatrix4(l.makeRotationAxis(r[g],d*g)),a[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class ms extends Qt{constructor(e=0,t=0,n=1,r=1,s=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new le){const n=t,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(a?s=0:s=r),this.aClockwise===!0&&!a&&(s===r?s=-r:s=s-r);const o=this.aStartAngle+e*s;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const u=Math.cos(this.aRotation),f=Math.sin(this.aRotation),h=l-this.aX,d=c-this.aY;l=h*u-d*f+this.aX,c=h*f+d*u+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Nl extends ms{constructor(e,t,n,r,s,a){super(e,t,n,n,r,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function gs(){let i=0,e=0,t=0,n=0;function r(s,a,o,l){i=s,e=o,t=-3*s+3*a-2*o-l,n=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){r(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,u,f){let h=(a-s)/c-(o-s)/(c+u)+(o-a)/u,d=(o-a)/u-(l-a)/(u+f)+(l-o)/f;h*=u,d*=u,r(a,o,h,d)},calc:function(s){const a=s*s,o=a*s;return i+e*s+t*a+n*o}}}const la=new D,ca=new D,Yr=new gs,Zr=new gs,Jr=new gs;class Ul extends Qt{constructor(e=[],t=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new D){const n=t,r=this.points,s=r.length,a=(s-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:l===0&&o===s-1&&(o=s-2,l=1);let c,u;this.closed||o>0?c=r[(o-1)%s]:(ca.subVectors(r[0],r[1]).add(r[0]),c=ca);const f=r[o%s],h=r[(o+1)%s];if(this.closed||o+2<s?u=r[(o+2)%s]:(la.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=la),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(f),d),M=Math.pow(f.distanceToSquared(h),d),m=Math.pow(h.distanceToSquared(u),d);M<1e-4&&(M=1),g<1e-4&&(g=M),m<1e-4&&(m=M),Yr.initNonuniformCatmullRom(c.x,f.x,h.x,u.x,g,M,m),Zr.initNonuniformCatmullRom(c.y,f.y,h.y,u.y,g,M,m),Jr.initNonuniformCatmullRom(c.z,f.z,h.z,u.z,g,M,m)}else this.curveType==="catmullrom"&&(Yr.initCatmullRom(c.x,f.x,h.x,u.x,this.tension),Zr.initCatmullRom(c.y,f.y,h.y,u.y,this.tension),Jr.initCatmullRom(c.z,f.z,h.z,u.z,this.tension));return n.set(Yr.calc(l),Zr.calc(l),Jr.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(new D().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function ha(i,e,t,n,r){const s=(n-e)*.5,a=(r-t)*.5,o=i*i,l=i*o;return(2*t-2*n+s+a)*l+(-3*t+3*n-2*s-a)*o+s*i+t}function Ol(i,e){const t=1-i;return t*t*e}function Bl(i,e){return 2*(1-i)*i*e}function Gl(i,e){return i*i*e}function Ai(i,e,t,n){return Ol(i,e)+Bl(i,t)+Gl(i,n)}function Vl(i,e){const t=1-i;return t*t*t*e}function zl(i,e){const t=1-i;return 3*t*t*i*e}function Hl(i,e){return 3*(1-i)*i*i*e}function kl(i,e){return i*i*i*e}function Ri(i,e,t,n,r){return Vl(i,e)+zl(i,t)+Hl(i,n)+kl(i,r)}class io extends Qt{constructor(e=new le,t=new le,n=new le,r=new le){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new le){const n=t,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Ri(e,r.x,s.x,a.x,o.x),Ri(e,r.y,s.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Wl extends Qt{constructor(e=new D,t=new D,n=new D,r=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new D){const n=t,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Ri(e,r.x,s.x,a.x,o.x),Ri(e,r.y,s.y,a.y,o.y),Ri(e,r.z,s.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class ro extends Qt{constructor(e=new le,t=new le){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new le){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new le){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Xl extends Qt{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class so extends Qt{constructor(e=new le,t=new le,n=new le){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new le){const n=t,r=this.v0,s=this.v1,a=this.v2;return n.set(Ai(e,r.x,s.x,a.x),Ai(e,r.y,s.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ao extends Qt{constructor(e=new D,t=new D,n=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new D){const n=t,r=this.v0,s=this.v1,a=this.v2;return n.set(Ai(e,r.x,s.x,a.x),Ai(e,r.y,s.y,a.y),Ai(e,r.z,s.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class oo extends Qt{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new le){const n=t,r=this.points,s=(r.length-1)*e,a=Math.floor(s),o=s-a,l=r[a===0?a:a-1],c=r[a],u=r[a>r.length-2?r.length-1:a+1],f=r[a>r.length-3?r.length-1:a+2];return n.set(ha(o,l.x,c.x,u.x,f.x),ha(o,l.y,c.y,u.y,f.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(new le().fromArray(r))}return this}}var _r=Object.freeze({__proto__:null,ArcCurve:Nl,CatmullRomCurve3:Ul,CubicBezierCurve:io,CubicBezierCurve3:Wl,EllipseCurve:ms,LineCurve:ro,LineCurve3:Xl,QuadraticBezierCurve:so,QuadraticBezierCurve3:ao,SplineCurve:oo});class ql extends Qt{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new _r[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=n){const a=r[s]-n,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let r=0,s=this.curves;r<s.length;r++){const a=s[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const u=l[c];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const r=e.curves[t];this.curves.push(new _r[r.type]().fromJSON(r))}return this}}class ua extends ql{constructor(e){super(),this.type="Path",this.currentPoint=new le,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new ro(this.currentPoint.clone(),new le(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){const s=new so(this.currentPoint.clone(),new le(e,t),new le(n,r));return this.curves.push(s),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,s,a){const o=new io(this.currentPoint.clone(),new le(e,t),new le(n,r),new le(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new oo(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,s,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,r,s,a),this}absarc(e,t,n,r,s,a){return this.absellipse(e,t,n,n,r,s,a),this}ellipse(e,t,n,r,s,a,o,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,n,r,s,a,o,l),this}absellipse(e,t,n,r,s,a,o,l){const c=new ms(e,t,n,r,s,a,o,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class lo extends ua{constructor(e){super(e),this.uuid=In(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const r=e.holes[t];this.holes.push(new ua().fromJSON(r))}return this}}function Yl(i,e,t=2){const n=e&&e.length,r=n?e[0]*t:i.length;let s=co(i,0,r,t,!0);const a=[];if(!s||s.next===s.prev)return a;let o,l,c;if(n&&(s=Ql(i,e,s,t)),i.length>80*t){o=i[0],l=i[1];let u=o,f=l;for(let h=t;h<r;h+=t){const d=i[h],g=i[h+1];d<o&&(o=d),g<l&&(l=g),d>u&&(u=d),g>f&&(f=g)}c=Math.max(u-o,f-l),c=c!==0?32767/c:0}return Pi(s,a,t,o,l,c,0),a}function co(i,e,t,n,r){let s;if(r===cc(i,e,t,n)>0)for(let a=e;a<t;a+=n)s=fa(a/n|0,i[a],i[a+1],s);else for(let a=t-n;a>=e;a-=n)s=fa(a/n|0,i[a],i[a+1],s);return s&&oi(s,s.next)&&(Di(s),s=s.next),s}function Ln(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(oi(t,t.next)||gt(t.prev,t,t.next)===0)){if(Di(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Pi(i,e,t,n,r,s,a){if(!i)return;!a&&s&&ic(i,n,r,s);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(s?Jl(i,n,r,s):Zl(i)){e.push(l.i,i.i,c.i),Di(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=Kl(Ln(i),e),Pi(i,e,t,n,r,s,2)):a===2&&$l(i,e,t,n,r,s):Pi(Ln(i),e,t,n,r,s,1);break}}}function Zl(i){const e=i.prev,t=i,n=i.next;if(gt(e,t,n)>=0)return!1;const r=e.x,s=t.x,a=n.x,o=e.y,l=t.y,c=n.y,u=Math.min(r,s,a),f=Math.min(o,l,c),h=Math.max(r,s,a),d=Math.max(o,l,c);let g=n.next;for(;g!==e;){if(g.x>=u&&g.x<=h&&g.y>=f&&g.y<=d&&yi(r,o,s,l,a,c,g.x,g.y)&&gt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Jl(i,e,t,n){const r=i.prev,s=i,a=i.next;if(gt(r,s,a)>=0)return!1;const o=r.x,l=s.x,c=a.x,u=r.y,f=s.y,h=a.y,d=Math.min(o,l,c),g=Math.min(u,f,h),M=Math.max(o,l,c),m=Math.max(u,f,h),p=as(d,g,e,t,n),y=as(M,m,e,t,n);let E=i.prevZ,v=i.nextZ;for(;E&&E.z>=p&&v&&v.z<=y;){if(E.x>=d&&E.x<=M&&E.y>=g&&E.y<=m&&E!==r&&E!==a&&yi(o,u,l,f,c,h,E.x,E.y)&&gt(E.prev,E,E.next)>=0||(E=E.prevZ,v.x>=d&&v.x<=M&&v.y>=g&&v.y<=m&&v!==r&&v!==a&&yi(o,u,l,f,c,h,v.x,v.y)&&gt(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;E&&E.z>=p;){if(E.x>=d&&E.x<=M&&E.y>=g&&E.y<=m&&E!==r&&E!==a&&yi(o,u,l,f,c,h,E.x,E.y)&&gt(E.prev,E,E.next)>=0)return!1;E=E.prevZ}for(;v&&v.z<=y;){if(v.x>=d&&v.x<=M&&v.y>=g&&v.y<=m&&v!==r&&v!==a&&yi(o,u,l,f,c,h,v.x,v.y)&&gt(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function Kl(i,e){let t=i;do{const n=t.prev,r=t.next.next;!oi(n,r)&&uo(n,t,t.next,r)&&Li(n,r)&&Li(r,n)&&(e.push(n.i,t.i,r.i),Di(t),Di(t.next),t=i=r),t=t.next}while(t!==i);return Ln(t)}function $l(i,e,t,n,r,s){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&ac(a,o)){let l=fo(a,o);a=Ln(a,a.next),l=Ln(l,l.next),Pi(a,e,t,n,r,s,0),Pi(l,e,t,n,r,s,0);return}o=o.next}a=a.next}while(a!==i)}function Ql(i,e,t,n){const r=[];for(let s=0,a=e.length;s<a;s++){const o=e[s]*n,l=s<a-1?e[s+1]*n:i.length,c=co(i,o,l,n,!1);c===c.next&&(c.steiner=!0),r.push(sc(c))}r.sort(jl);for(let s=0;s<r.length;s++)t=ec(r[s],t);return t}function jl(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),r=(e.next.y-e.y)/(e.next.x-e.x);t=n-r}return t}function ec(i,e){const t=tc(i,e);if(!t)return e;const n=fo(t,i);return Ln(n,n.next),Ln(t,t.next)}function tc(i,e){let t=e;const n=i.x,r=i.y;let s=-1/0,a;if(oi(i,t))return t;do{if(oi(i,t.next))return t.next;if(r<=t.y&&r>=t.next.y&&t.next.y!==t.y){const f=t.x+(r-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=n&&f>s&&(s=f,a=t.x<t.next.x?t:t.next,f===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let u=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&ho(r<c?n:s,r,l,c,r<c?s:n,r,t.x,t.y)){const f=Math.abs(r-t.y)/(n-t.x);Li(t,i)&&(f<u||f===u&&(t.x>a.x||t.x===a.x&&nc(a,t)))&&(a=t,u=f)}t=t.next}while(t!==o);return a}function nc(i,e){return gt(i.prev,i,e.prev)<0&&gt(e.next,i,i.next)<0}function ic(i,e,t,n){let r=i;do r.z===0&&(r.z=as(r.x,r.y,e,t,n)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==i);r.prevZ.nextZ=null,r.prevZ=null,rc(r)}function rc(i){let e,t=1;do{let n=i,r;i=null;let s=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(r=n,n=n.nextZ,o--):(r=a,a=a.nextZ,l--),s?s.nextZ=r:i=r,r.prevZ=s,s=r;n=a}s.nextZ=null,t*=2}while(e>1);return i}function as(i,e,t,n,r){return i=(i-t)*r|0,e=(e-n)*r|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function sc(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function ho(i,e,t,n,r,s,a,o){return(r-a)*(e-o)>=(i-a)*(s-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(r-a)*(n-o)}function yi(i,e,t,n,r,s,a,o){return!(i===a&&e===o)&&ho(i,e,t,n,r,s,a,o)}function ac(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!oc(i,e)&&(Li(i,e)&&Li(e,i)&&lc(i,e)&&(gt(i.prev,i,e.prev)||gt(i,e.prev,e))||oi(i,e)&&gt(i.prev,i,i.next)>0&&gt(e.prev,e,e.next)>0)}function gt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function oi(i,e){return i.x===e.x&&i.y===e.y}function uo(i,e,t,n){const r=sr(gt(i,e,t)),s=sr(gt(i,e,n)),a=sr(gt(t,n,i)),o=sr(gt(t,n,e));return!!(r!==s&&a!==o||r===0&&rr(i,t,e)||s===0&&rr(i,n,e)||a===0&&rr(t,i,n)||o===0&&rr(t,e,n))}function rr(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function sr(i){return i>0?1:i<0?-1:0}function oc(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&uo(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Li(i,e){return gt(i.prev,i,i.next)<0?gt(i,e,i.next)>=0&&gt(i,i.prev,e)>=0:gt(i,e,i.prev)<0||gt(i,i.next,e)<0}function lc(i,e){let t=i,n=!1;const r=(i.x+e.x)/2,s=(i.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&r<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function fo(i,e){const t=os(i.i,i.x,i.y),n=os(e.i,e.x,e.y),r=i.next,s=e.prev;return i.next=e,e.prev=i,t.next=r,r.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function fa(i,e,t,n){const r=os(i,e,t);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function Di(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function os(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function cc(i,e,t,n){let r=0;for(let s=e,a=t-n;s<t;s+=n)r+=(i[a]-i[s])*(i[s+1]+i[a+1]),a=s;return r}class hc{static triangulate(e,t,n=2){return Yl(e,t,n)}}class ln{static area(e){const t=e.length;let n=0;for(let r=t-1,s=0;s<t;r=s++)n+=e[r].x*e[s].y-e[s].x*e[r].y;return n*.5}static isClockWise(e){return ln.area(e)<0}static triangulateShape(e,t){const n=[],r=[],s=[];da(e),pa(n,e);let a=e.length;t.forEach(da);for(let l=0;l<t.length;l++)r.push(a),a+=t[l].length,pa(n,t[l]);const o=hc.triangulate(n,r);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}}function da(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function pa(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class po extends Mt{constructor(e=new lo([new le(.5,.5),new le(-.5,.5),new le(-.5,-.5),new le(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,r=[],s=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];a(c)}this.setAttribute("position",new $e(r,3)),this.setAttribute("uv",new $e(s,2)),this.computeVertexNormals();function a(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,f=t.depth!==void 0?t.depth:1;let h=t.bevelEnabled!==void 0?t.bevelEnabled:!0,d=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:d-.1,M=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,y=t.UVGenerator!==void 0?t.UVGenerator:uc;let E,v=!1,R,T,P,_;if(p){E=p.getSpacedPoints(u),v=!0,h=!1;const j=p.isCatmullRomCurve3?p.closed:!1;R=p.computeFrenetFrames(u,j),T=new D,P=new D,_=new D}h||(m=0,d=0,g=0,M=0);const b=o.extractPoints(c);let w=b.shape;const F=b.holes;if(!ln.isClockWise(w)){w=w.reverse();for(let j=0,re=F.length;j<re;j++){const ie=F[j];ln.isClockWise(ie)&&(F[j]=ie.reverse())}}function k(j){const ie=10000000000000001e-36;let Ee=j[0];for(let ge=1;ge<=j.length;ge++){const Be=ge%j.length,we=j[Be],Ue=we.x-Ee.x,We=we.y-Ee.y,tt=Ue*Ue+We*We,rt=Math.max(Math.abs(we.x),Math.abs(we.y),Math.abs(Ee.x),Math.abs(Ee.y)),pt=ie*rt*rt;if(tt<=pt){j.splice(Be,1),ge--;continue}Ee=we}}k(w),F.forEach(k);const W=F.length,V=w;for(let j=0;j<W;j++){const re=F[j];w=w.concat(re)}function H(j,re,ie){return re||je("ExtrudeGeometry: vec does not exist"),j.clone().addScaledVector(re,ie)}const z=w.length;function Q(j,re,ie){let Ee,ge,Be;const we=j.x-re.x,Ue=j.y-re.y,We=ie.x-j.x,tt=ie.y-j.y,rt=we*we+Ue*Ue,pt=we*tt-Ue*We;if(Math.abs(pt)>Number.EPSILON){const A=Math.sqrt(rt),S=Math.sqrt(We*We+tt*tt),B=re.x-Ue/A,Y=re.y+we/A,ne=ie.x-tt/S,he=ie.y+We/S,ue=((ne-B)*tt-(he-Y)*We)/(we*tt-Ue*We);Ee=B+we*ue-j.x,ge=Y+Ue*ue-j.y;const X=Ee*Ee+ge*ge;if(X<=2)return new le(Ee,ge);Be=Math.sqrt(X/2)}else{let A=!1;we>Number.EPSILON?We>Number.EPSILON&&(A=!0):we<-Number.EPSILON?We<-Number.EPSILON&&(A=!0):Math.sign(Ue)===Math.sign(tt)&&(A=!0),A?(Ee=-Ue,ge=we,Be=Math.sqrt(rt)):(Ee=we,ge=Ue,Be=Math.sqrt(rt/2))}return new le(Ee/Be,ge/Be)}const se=[];for(let j=0,re=V.length,ie=re-1,Ee=j+1;j<re;j++,ie++,Ee++)ie===re&&(ie=0),Ee===re&&(Ee=0),se[j]=Q(V[j],V[ie],V[Ee]);const ce=[];let me,Re=se.concat();for(let j=0,re=W;j<re;j++){const ie=F[j];me=[];for(let Ee=0,ge=ie.length,Be=ge-1,we=Ee+1;Ee<ge;Ee++,Be++,we++)Be===ge&&(Be=0),we===ge&&(we=0),me[Ee]=Q(ie[Ee],ie[Be],ie[we]);ce.push(me),Re=Re.concat(me)}let Qe;if(m===0)Qe=ln.triangulateShape(V,F);else{const j=[],re=[];for(let ie=0;ie<m;ie++){const Ee=ie/m,ge=d*Math.cos(Ee*Math.PI/2),Be=g*Math.sin(Ee*Math.PI/2)+M;for(let we=0,Ue=V.length;we<Ue;we++){const We=H(V[we],se[we],Be);Ne(We.x,We.y,-ge),Ee===0&&j.push(We)}for(let we=0,Ue=W;we<Ue;we++){const We=F[we];me=ce[we];const tt=[];for(let rt=0,pt=We.length;rt<pt;rt++){const A=H(We[rt],me[rt],Be);Ne(A.x,A.y,-ge),Ee===0&&tt.push(A)}Ee===0&&re.push(tt)}}Qe=ln.triangulateShape(j,re)}const st=Qe.length,it=g+M;for(let j=0;j<z;j++){const re=h?H(w[j],Re[j],it):w[j];v?(P.copy(R.normals[0]).multiplyScalar(re.x),T.copy(R.binormals[0]).multiplyScalar(re.y),_.copy(E[0]).add(P).add(T),Ne(_.x,_.y,_.z)):Ne(re.x,re.y,0)}for(let j=1;j<=u;j++)for(let re=0;re<z;re++){const ie=h?H(w[re],Re[re],it):w[re];v?(P.copy(R.normals[j]).multiplyScalar(ie.x),T.copy(R.binormals[j]).multiplyScalar(ie.y),_.copy(E[j]).add(P).add(T),Ne(_.x,_.y,_.z)):Ne(ie.x,ie.y,f/u*j)}for(let j=m-1;j>=0;j--){const re=j/m,ie=d*Math.cos(re*Math.PI/2),Ee=g*Math.sin(re*Math.PI/2)+M;for(let ge=0,Be=V.length;ge<Be;ge++){const we=H(V[ge],se[ge],Ee);Ne(we.x,we.y,f+ie)}for(let ge=0,Be=F.length;ge<Be;ge++){const we=F[ge];me=ce[ge];for(let Ue=0,We=we.length;Ue<We;Ue++){const tt=H(we[Ue],me[Ue],Ee);v?Ne(tt.x,tt.y+E[u-1].y,E[u-1].x+ie):Ne(tt.x,tt.y,f+ie)}}}K(),_e();function K(){const j=r.length/3;if(h){let re=0,ie=z*re;for(let Ee=0;Ee<st;Ee++){const ge=Qe[Ee];He(ge[2]+ie,ge[1]+ie,ge[0]+ie)}re=u+m*2,ie=z*re;for(let Ee=0;Ee<st;Ee++){const ge=Qe[Ee];He(ge[0]+ie,ge[1]+ie,ge[2]+ie)}}else{for(let re=0;re<st;re++){const ie=Qe[re];He(ie[2],ie[1],ie[0])}for(let re=0;re<st;re++){const ie=Qe[re];He(ie[0]+z*u,ie[1]+z*u,ie[2]+z*u)}}n.addGroup(j,r.length/3-j,0)}function _e(){const j=r.length/3;let re=0;fe(V,re),re+=V.length;for(let ie=0,Ee=F.length;ie<Ee;ie++){const ge=F[ie];fe(ge,re),re+=ge.length}n.addGroup(j,r.length/3-j,1)}function fe(j,re){let ie=j.length;for(;--ie>=0;){const Ee=ie;let ge=ie-1;ge<0&&(ge=j.length-1);for(let Be=0,we=u+m*2;Be<we;Be++){const Ue=z*Be,We=z*(Be+1),tt=re+Ee+Ue,rt=re+ge+Ue,pt=re+ge+We,A=re+Ee+We;Ge(tt,rt,pt,A)}}}function Ne(j,re,ie){l.push(j),l.push(re),l.push(ie)}function He(j,re,ie){ht(j),ht(re),ht(ie);const Ee=r.length/3,ge=y.generateTopUV(n,r,Ee-3,Ee-2,Ee-1);Ve(ge[0]),Ve(ge[1]),Ve(ge[2])}function Ge(j,re,ie,Ee){ht(j),ht(re),ht(Ee),ht(re),ht(ie),ht(Ee);const ge=r.length/3,Be=y.generateSideWallUV(n,r,ge-6,ge-3,ge-2,ge-1);Ve(Be[0]),Ve(Be[1]),Ve(Be[3]),Ve(Be[1]),Ve(Be[2]),Ve(Be[3])}function ht(j){r.push(l[j*3+0]),r.push(l[j*3+1]),r.push(l[j*3+2])}function Ve(j){s.push(j.x),s.push(j.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return fc(t,n,e)}static fromJSON(e,t){const n=[];for(let s=0,a=e.shapes.length;s<a;s++){const o=t[e.shapes[s]];n.push(o)}const r=e.options.extrudePath;return r!==void 0&&(e.options.extrudePath=new _r[r.type]().fromJSON(r)),new po(n,e.options)}}const uc={generateTopUV:function(i,e,t,n,r){const s=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[r*3],u=e[r*3+1];return[new le(s,a),new le(o,l),new le(c,u)]},generateSideWallUV:function(i,e,t,n,r,s){const a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],u=e[n*3+1],f=e[n*3+2],h=e[r*3],d=e[r*3+1],g=e[r*3+2],M=e[s*3],m=e[s*3+1],p=e[s*3+2];return Math.abs(o-u)<Math.abs(a-c)?[new le(a,1-l),new le(c,1-f),new le(h,1-g),new le(M,1-p)]:[new le(o,1-l),new le(u,1-f),new le(d,1-g),new le(m,1-p)]}};function fc(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,r=i.length;n<r;n++){const s=i[n];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class mo extends Mt{constructor(e=[new le(0,-.5),new le(.5,0),new le(0,.5)],t=12,n=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:r},t=Math.floor(t),r=ze(r,0,Math.PI*2);const s=[],a=[],o=[],l=[],c=[],u=1/t,f=new D,h=new le,d=new D,g=new D,M=new D;let m=0,p=0;for(let y=0;y<=e.length-1;y++)switch(y){case 0:m=e[y+1].x-e[y].x,p=e[y+1].y-e[y].y,d.x=p*1,d.y=-m,d.z=p*0,M.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case e.length-1:l.push(M.x,M.y,M.z);break;default:m=e[y+1].x-e[y].x,p=e[y+1].y-e[y].y,d.x=p*1,d.y=-m,d.z=p*0,g.copy(d),d.x+=M.x,d.y+=M.y,d.z+=M.z,d.normalize(),l.push(d.x,d.y,d.z),M.copy(g)}for(let y=0;y<=t;y++){const E=n+y*u*r,v=Math.sin(E),R=Math.cos(E);for(let T=0;T<=e.length-1;T++){f.x=e[T].x*v,f.y=e[T].y,f.z=e[T].x*R,a.push(f.x,f.y,f.z),h.x=y/t,h.y=T/(e.length-1),o.push(h.x,h.y);const P=l[3*T+0]*v,_=l[3*T+1],b=l[3*T+0]*R;c.push(P,_,b)}}for(let y=0;y<t;y++)for(let E=0;E<e.length-1;E++){const v=E+y*e.length,R=v,T=v+e.length,P=v+e.length+1,_=v+1;s.push(R,T,_),s.push(P,_,T)}this.setIndex(s),this.setAttribute("position",new $e(a,3)),this.setAttribute("uv",new $e(o,2)),this.setAttribute("normal",new $e(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new mo(e.points,e.segments,e.phiStart,e.phiLength)}}class go extends ps{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],r=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,r,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new go(e.radius,e.detail)}}class vr extends Mt{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(r),c=o+1,u=l+1,f=e/o,h=t/l,d=[],g=[],M=[],m=[];for(let p=0;p<u;p++){const y=p*h-a;for(let E=0;E<c;E++){const v=E*f-s;g.push(v,-y,0),M.push(0,0,1),m.push(E/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<o;y++){const E=y+c*p,v=y+c*(p+1),R=y+1+c*(p+1),T=y+1+c*p;d.push(E,v,T),d.push(v,R,T)}this.setIndex(d),this.setAttribute("position",new $e(g,3)),this.setAttribute("normal",new $e(M,3)),this.setAttribute("uv",new $e(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new vr(e.width,e.height,e.widthSegments,e.heightSegments)}}class _o extends Mt{constructor(e=new lo([new le(0,.5),new le(-.5,-.5),new le(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],r=[],s=[],a=[];let o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let u=0;u<e.length;u++)c(e[u]),this.addGroup(o,l,u),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new $e(r,3)),this.setAttribute("normal",new $e(s,3)),this.setAttribute("uv",new $e(a,2));function c(u){const f=r.length/3,h=u.extractPoints(t);let d=h.shape;const g=h.holes;ln.isClockWise(d)===!1&&(d=d.reverse());for(let m=0,p=g.length;m<p;m++){const y=g[m];ln.isClockWise(y)===!0&&(g[m]=y.reverse())}const M=ln.triangulateShape(d,g);for(let m=0,p=g.length;m<p;m++){const y=g[m];d=d.concat(y)}for(let m=0,p=d.length;m<p;m++){const y=d[m];r.push(y.x,y.y,0),s.push(0,0,1),a.push(y.x,y.y)}for(let m=0,p=M.length;m<p;m++){const y=M[m],E=y[0]+f,v=y[1]+f,R=y[2]+f;n.push(E,v,R),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return dc(t,e)}static fromJSON(e,t){const n=[];for(let r=0,s=e.shapes.length;r<s;r++){const a=t[e.shapes[r]];n.push(a)}return new _o(n,e.curveSegments)}}function dc(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){const r=i[t];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e}class vo extends Mt{constructor(e=1,t=32,n=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const u=[],f=new D,h=new D,d=[],g=[],M=[],m=[];for(let p=0;p<=n;p++){const y=[],E=p/n,v=a+E*o,R=e*Math.cos(v),T=Math.sqrt(e*e-R*R);let P=0;p===0&&a===0?P=.5/t:p===n&&l===Math.PI&&(P=-.5/t);for(let _=0;_<=t;_++){const b=_/t,w=r+b*s;f.x=-T*Math.cos(w),f.y=R,f.z=T*Math.sin(w),g.push(f.x,f.y,f.z),h.copy(f).normalize(),M.push(h.x,h.y,h.z),m.push(b+P,1-E),y.push(c++)}u.push(y)}for(let p=0;p<n;p++)for(let y=0;y<t;y++){const E=u[p][y+1],v=u[p][y],R=u[p+1][y],T=u[p+1][y+1];(p!==0||a>0)&&d.push(E,v,T),(p!==n-1||l<Math.PI)&&d.push(v,R,T)}this.setIndex(d),this.setAttribute("position",new $e(g,3)),this.setAttribute("normal",new $e(M,3)),this.setAttribute("uv",new $e(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new vo(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class xo extends Mt{constructor(e=1,t=.4,n=12,r=48,s=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:s,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);const l=[],c=[],u=[],f=[],h=new D,d=new D,g=new D;for(let M=0;M<=n;M++){const m=a+M/n*o;for(let p=0;p<=r;p++){const y=p/r*s;d.x=(e+t*Math.cos(m))*Math.cos(y),d.y=(e+t*Math.cos(m))*Math.sin(y),d.z=t*Math.sin(m),c.push(d.x,d.y,d.z),h.x=e*Math.cos(y),h.y=e*Math.sin(y),g.subVectors(d,h).normalize(),u.push(g.x,g.y,g.z),f.push(p/r),f.push(M/n)}}for(let M=1;M<=n;M++)for(let m=1;m<=r;m++){const p=(r+1)*M+m-1,y=(r+1)*(M-1)+m-1,E=(r+1)*(M-1)+m,v=(r+1)*M+m;l.push(p,y,v),l.push(y,E,v)}this.setIndex(l),this.setAttribute("position",new $e(c,3)),this.setAttribute("normal",new $e(u,3)),this.setAttribute("uv",new $e(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xo(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class So extends Mt{constructor(e=new ao(new D(-1,-1,0),new D(-1,1,0),new D(1,1,0)),t=64,n=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:r,closed:s};const a=e.computeFrenetFrames(t,s);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new D,l=new D,c=new le;let u=new D;const f=[],h=[],d=[],g=[];M(),this.setIndex(g),this.setAttribute("position",new $e(f,3)),this.setAttribute("normal",new $e(h,3)),this.setAttribute("uv",new $e(d,2));function M(){for(let E=0;E<t;E++)m(E);m(s===!1?t:0),y(),p()}function m(E){u=e.getPointAt(E/t,u);const v=a.normals[E],R=a.binormals[E];for(let T=0;T<=r;T++){const P=T/r*Math.PI*2,_=Math.sin(P),b=-Math.cos(P);l.x=b*v.x+_*R.x,l.y=b*v.y+_*R.y,l.z=b*v.z+_*R.z,l.normalize(),h.push(l.x,l.y,l.z),o.x=u.x+n*l.x,o.y=u.y+n*l.y,o.z=u.z+n*l.z,f.push(o.x,o.y,o.z)}}function p(){for(let E=1;E<=t;E++)for(let v=1;v<=r;v++){const R=(r+1)*(E-1)+(v-1),T=(r+1)*E+(v-1),P=(r+1)*E+v,_=(r+1)*(E-1)+v;g.push(R,T,_),g.push(T,P,_)}}function y(){for(let E=0;E<=t;E++)for(let v=0;v<=r;v++)c.x=E/t,c.y=v/r,d.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new So(new _r[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class Cm extends fn{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new Ye(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}function li(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const r=i[t][n];if(ma(r))r.isRenderTargetTexture?(Oe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone();else if(Array.isArray(r))if(ma(r[0])){const s=[];for(let a=0,o=r.length;a<o;a++)s[a]=r[a].clone();e[t][n]=s}else e[t][n]=r.slice();else e[t][n]=r}}return e}function Lt(i){const e={};for(let t=0;t<i.length;t++){const n=li(i[t]);for(const r in n)e[r]=n[r]}return e}function ma(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function pc(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Mo(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:et.workingColorSpace}const mc={clone:li,merge:Lt};var gc=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,_c=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class $t extends fn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=gc,this.fragmentShader=_c,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=li(e.uniforms),this.uniformsGroups=pc(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case"t":this.uniforms[n].value=t[r.value]||null;break;case"c":this.uniforms[n].value=new Ye().setHex(r.value);break;case"v2":this.uniforms[n].value=new le().fromArray(r.value);break;case"v3":this.uniforms[n].value=new D().fromArray(r.value);break;case"v4":this.uniforms[n].value=new dt().fromArray(r.value);break;case"m3":this.uniforms[n].value=new qe().fromArray(r.value);break;case"m4":this.uniforms[n].value=new ot().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class vc extends $t{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class xc extends fn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ye(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ye(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new un,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class wm extends xc{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new le(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ze(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ye(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ye(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ye(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Pm extends fn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ye(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ye(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new un,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Sc extends fn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Mc extends fn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const cn={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(ga(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!ga(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function ga(i){try{const e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class yc{constructor(e,t,n){const r=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){o++,s===!1&&r.onStart!==void 0&&r.onStart(u,a,o),s=!0},this.itemEnd=function(u){a++,r.onProgress!==void 0&&r.onProgress(u,a,o),a===o&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,f){return c.push(u,f),this},this.removeHandler=function(u){const f=c.indexOf(u);return f!==-1&&c.splice(f,2),this},this.getHandler=function(u){for(let f=0,h=c.length;f<h;f+=2){const d=c[f],g=c[f+1];if(d.global&&(d.lastIndex=0),d.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const Ec=new yc;class hi{constructor(e){this.manager=e!==void 0?e:Ec,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(r,s){n.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}hi.DEFAULT_MATERIAL_NAME="__DEFAULT";const an={};class Tc extends Error{constructor(e,t){super(e),this.response=t}}class bc extends hi{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=cn.get(`file:${e}`);if(s!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0);return}if(an[e]!==void 0){an[e].push({onLoad:t,onProgress:n,onError:r});return}an[e]=[],an[e].push({onLoad:t,onProgress:n,onError:r});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Oe("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const u=an[e],f=c.body.getReader(),h=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=h?parseInt(h):0,g=d!==0;let M=0;const m=new ReadableStream({start(p){y();function y(){f.read().then(({done:E,value:v})=>{if(E)p.close();else{M+=v.byteLength;const R=new ProgressEvent("progress",{lengthComputable:g,loaded:M,total:d});for(let T=0,P=u.length;T<P;T++){const _=u[T];_.onProgress&&_.onProgress(R)}p.enqueue(v),y()}},E=>{p.error(E)})}}});return new Response(m)}else throw new Tc(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,o));case"json":return c.json();default:if(o==="")return c.text();{const f=/charset="?([^;"\s]*)"?/i.exec(o),h=f&&f[1]?f[1].toLowerCase():void 0,d=new TextDecoder(h);return c.arrayBuffer().then(g=>d.decode(g))}}}).then(c=>{cn.add(`file:${e}`,c);const u=an[e];delete an[e];for(let f=0,h=u.length;f<h;f++){const d=u[f];d.onLoad&&d.onLoad(c)}}).catch(c=>{const u=an[e];if(u===void 0)throw this.manager.itemError(e),c;delete an[e];for(let f=0,h=u.length;f<h;f++){const d=u[f];d.onError&&d.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Kn=new WeakMap;class Ac extends hi{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=cn.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);else{let f=Kn.get(a);f===void 0&&(f=[],Kn.set(a,f)),f.push({onLoad:t,onError:r})}return a}const o=Ci("img");function l(){u(),t&&t(this);const f=Kn.get(this)||[];for(let h=0;h<f.length;h++){const d=f[h];d.onLoad&&d.onLoad(this)}Kn.delete(this),s.manager.itemEnd(e)}function c(f){u(),r&&r(f),cn.remove(`image:${e}`);const h=Kn.get(this)||[];for(let d=0;d<h.length;d++){const g=h[d];g.onError&&g.onError(f)}Kn.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function u(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),cn.add(`image:${e}`,o),s.manager.itemStart(e),o.src=e,o}}class Lm extends hi{constructor(e){super(e)}load(e,t,n,r){const s=this,a=new pr,o=new bc(this.manager);return o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(s.withCredentials),o.load(e,function(l){let c;try{c=s.parse(l)}catch(u){r!==void 0?r(u):je(u);return}s._applyTexData(a,c),t&&t(a,c)},n,r),a}createDataTexture(e){const t=new pr;return this._applyTexData(t,this.parse(e)),t}_applyTexData(e,t){t.image!==void 0?e.image=t.image:t.data!==void 0&&(e.image.width=t.width,e.image.height=t.height,e.image.data=t.data),e.wrapS=t.wrapS!==void 0?t.wrapS:1001,e.wrapT=t.wrapT!==void 0?t.wrapT:1001,e.magFilter=t.magFilter!==void 0?t.magFilter:1006,e.minFilter=t.minFilter!==void 0?t.minFilter:1006,e.anisotropy=t.anisotropy!==void 0?t.anisotropy:1,t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.mipmaps!==void 0&&(e.mipmaps=t.mipmaps,e.minFilter=1008),t.mipmapCount===1&&(e.minFilter=1006),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),e.needsUpdate=!0}}class Dm extends hi{constructor(e){super(e)}load(e,t,n,r){const s=new Rt,a=new Ac(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},n,r),s}}class xr extends At{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ye(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}const Kr=new ot,_a=new D,va=new D;class yo{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new le(512,512),this.mapType=1009,this.map=null,this.mapPass=null,this.matrix=new ot,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ds,this._frameExtents=new le(1,1),this._viewportCount=1,this._viewports=[new dt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;_a.setFromMatrixPosition(e.matrixWorld),t.position.copy(_a),va.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(va),t.updateMatrixWorld(),Kr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Kr,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===2001||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Kr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const ar=new D,or=new ci,Yt=new D;class Eo extends At{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ot,this.projectionMatrix=new ot,this.projectionMatrixInverse=new ot,this.coordinateSystem=2e3,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ar,or,Yt),Yt.x===1&&Yt.y===1&&Yt.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ar,or,Yt.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(ar,or,Yt),Yt.x===1&&Yt.y===1&&Yt.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ar,or,Yt.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const yn=new D,xa=new le,Sa=new le;class Vt extends Eo{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=wi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ti*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return wi*2*Math.atan(Math.tan(Ti*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){yn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(yn.x,yn.y).multiplyScalar(-e/yn.z),yn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(yn.x,yn.y).multiplyScalar(-e/yn.z)}getViewSize(e,t){return this.getViewBounds(e,xa,Sa),t.subVectors(Sa,xa)}setViewOffset(e,t,n,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ti*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*n/c,r*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Rc extends yo{constructor(){super(new Vt(90,1,.5,500)),this.isPointLightShadow=!0}}class Im extends xr{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new Rc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class _s extends Eo{constructor(e=-1,t=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Cc extends yo{constructor(){super(new _s(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Fm extends xr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(At.DEFAULT_UP),this.updateMatrix(),this.target=new At,this.shadow=new Cc}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class Nm extends xr{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Um extends xr{constructor(e,t,n=10,r=10){super(e,t),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=n,this.height=r}get power(){return this.intensity*this.width*this.height*Math.PI}set power(e){this.intensity=e/(this.width*this.height*Math.PI)}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){const t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}}const $r=new WeakMap;class Om extends hi{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Oe("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Oe("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=cn.get(`image-bitmap:${e}`);if(a!==void 0){if(s.manager.itemStart(e),a.then){a.then(c=>{$r.has(a)===!0?(r&&r($r.get(a)),s.manager.itemError(e),s.manager.itemEnd(e)):(t&&t(c),s.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);return}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(c){cn.add(`image-bitmap:${e}`,c),t&&t(c),s.manager.itemEnd(e)}).catch(function(c){r&&r(c),$r.set(l,c),cn.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});cn.add(`image-bitmap:${e}`,l),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const $n=-90,Qn=1;class wc extends At{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Vt($n,Qn,e,t);r.layers=this.layers,this.add(r);const s=new Vt($n,Qn,e,t);s.layers=this.layers,this.add(s);const a=new Vt($n,Qn,e,t);a.layers=this.layers,this.add(a);const o=new Vt($n,Qn,e,t);o.layers=this.layers,this.add(o);const l=new Vt($n,Qn,e,t);l.layers=this.layers,this.add(l);const c=new Vt($n,Qn,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,r,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,u]=this.children,f=e.getRenderTarget(),h=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,1,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=M,e.setRenderTarget(n,5,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(f,h,d),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Pc extends Vt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Bm{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Lc.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function Lc(){this._document.hidden===!1&&this.reset()}class Gm{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=ze(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(ze(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class To{static{To.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){const s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=r,this}}const Ma=new le;class Vm{constructor(e=new le(1/0,1/0),t=new le(-1/0,-1/0)){this.isBox2=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Ma.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(e){return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ma).distanceTo(e)}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const ya=new D,lr=new D,jn=new D,ei=new D,Qr=new D,Dc=new D,Ic=new D;class zm{constructor(e=new D,t=new D){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){ya.subVectors(e,this.start),lr.subVectors(this.end,this.start);const n=lr.dot(lr);if(n===0)return 0;let s=lr.dot(ya)/n;return t&&(s=ze(s,0,1)),s}closestPointToPoint(e,t,n){const r=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(r).add(this.start)}distanceSqToLine3(e,t=Dc,n=Ic){const r=10000000000000001e-32;let s,a;const o=this.start,l=e.start,c=this.end,u=e.end;jn.subVectors(c,o),ei.subVectors(u,l),Qr.subVectors(o,l);const f=jn.dot(jn),h=ei.dot(ei),d=ei.dot(Qr);if(f<=r&&h<=r)return t.copy(o),n.copy(l),t.sub(n),t.dot(t);if(f<=r)s=0,a=d/h,a=ze(a,0,1);else{const g=jn.dot(Qr);if(h<=r)a=0,s=ze(-g/f,0,1);else{const M=jn.dot(ei),m=f*h-M*M;m!==0?s=ze((M*d-g*h)/m,0,1):s=0,a=(M*s+d)/h,a<0?(a=0,s=ze(-g/f,0,1)):a>1&&(a=1,s=ze((M-g)/f,0,1))}}return t.copy(o).addScaledVector(jn,s),n.copy(l).addScaledVector(ei,a),t.distanceToSquared(n)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}function Ea(i,e,t,n){const r=Fc(n);switch(t){case 1021:return i*e;case 1028:return i*e/r.components*r.byteLength;case 1029:return i*e/r.components*r.byteLength;case 1030:return i*e*2/r.components*r.byteLength;case 1031:return i*e*2/r.components*r.byteLength;case 1022:return i*e*3/r.components*r.byteLength;case 1023:return i*e*4/r.components*r.byteLength;case 1033:return i*e*4/r.components*r.byteLength;case 33776:case 33777:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case 33778:case 33779:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case 35841:case 35843:return Math.max(i,16)*Math.max(e,8)/4;case 35840:case 35842:return Math.max(i,8)*Math.max(e,8)/2;case 36196:case 37492:case 37488:case 37489:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case 37496:case 37490:case 37491:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case 37808:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case 37809:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case 37810:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case 37811:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case 37812:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case 37813:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case 37814:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case 37815:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case 37816:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case 37817:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case 37818:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case 37819:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case 37820:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case 37821:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(i/4)*Math.ceil(e/4)*16;case 36283:case 36284:return Math.ceil(i/4)*Math.ceil(e/4)*8;case 36285:case 36286:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Fc(i){switch(i){case 1009:case 1010:return{byteLength:1,components:1};case 1012:case 1011:case 1016:return{byteLength:2,components:1};case 1017:case 1018:return{byteLength:2,components:4};case 1014:case 1013:case 1015:return{byteLength:4,components:1};case 35902:case 35899:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"185"}}));typeof window<"u"&&(window.__THREE__?Oe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="185");/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function bo(){let i=null,e=!1,t=null,n=null;function r(s,a){t(s,a),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function Nc(i){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,f=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,u),o.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){const u=l.array,f=l.updateRanges;if(i.bindBuffer(c,o),f.length===0)i.bufferSubData(c,0,u);else{f.sort((d,g)=>d.start-g.start);let h=0;for(let d=1;d<f.length;d++){const g=f[h],M=f[d];M.start<=g.start+g.count+1?g.count=Math.max(g.count,M.start+M.count-g.start):(++h,f[h]=M)}f.length=h+1;for(let d=0,g=f.length;d<g;d++){const M=f[d];i.bufferSubData(c,M.start*u.BYTES_PER_ELEMENT,u,M.start,M.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}var Uc=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Oc=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Bc=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Gc=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Vc=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,zc=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Hc=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,kc=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Wc=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Xc=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,qc=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Yc=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Zc=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Jc=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Kc=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,$c=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Qc=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,jc=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,eh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,th=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,nh=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,ih=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,rh=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,sh=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,ah=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,oh=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,lh=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ch=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,hh=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,uh=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,fh="gl_FragColor = linearToOutputTexel( gl_FragColor );",dh=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,ph=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,mh=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,gh=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,_h=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,vh=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,xh=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Sh=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Mh=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,yh=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Eh=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Th=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,bh=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ah=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Rh=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Ch=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,wh=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ph=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Lh=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Dh=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ih=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Fh=`#ifdef MUSIC_RECT_LTC_SHARED
uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
mat3 musicLTCSpecularTransform;
mat3 musicLTCDiffuseTransform;
mat3 musicLTCActiveTransform;
mat3 musicLTCInverse;
vec3 musicLTCFresnel;
#ifdef USE_CLEARCOAT
mat3 musicLTCClearcoatTransform;
mat3 musicLTCClearcoatInverse;
vec3 musicLTCClearcoatFresnel;
#endif
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	mat3 mat = musicLTCActiveTransform;
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void MusicPrepareRectLTCShared( const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		float roughness = material.roughness;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );

 musicLTCInverse = mInv;
 musicLTCFresnel = fresnel;
 {
 vec3 N = normal;
 vec3 V = viewDir;
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
 musicLTCSpecularTransform = mat;
 {
 mat3 mInv = mat3( 1.0 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
 musicLTCDiffuseTransform = mat;
 }
 }
#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;

 musicLTCClearcoatInverse = mInvClearcoat;
 musicLTCClearcoatFresnel = fresnelClearcoat;
 {
 vec3 N = Ncc;
 vec3 V = viewDir;
 mat3 mInv = mInvClearcoat;
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
 musicLTCClearcoatTransform = mat;
 }
#endif
}


#ifdef MUSIC_DIFFUSE_FIELD
uniform sampler2D musicDiffuseField,musicClearcoatField;
uniform float musicDiffuseFieldActive,musicDiffuseProbe,musicDiffuseFieldSize,musicDiffuseRadius;
uniform mat4 musicDiffuseViewToPlane,musicDiffuseCameraWorld;
vec2 musicDiffuseUV;vec3 musicDiffuseNormal;int musicDiffuseIndex;
void musicPrepareDiffuseField(vec3 position,vec3 normal){
 vec3 p=(musicDiffuseViewToPlane*vec4(position,1.)).xyz;
 musicDiffuseUV=p.xy/(2.*musicDiffuseRadius)+.5;
 musicDiffuseNormal=mat3(musicDiffuseCameraWorld)*normal;

}
vec3 musicDiffuseLTC(vec3 n,vec3 v,vec3 p,vec3 corners[4]){

 vec2 cell=vec2(float(musicDiffuseIndex%3),float(musicDiffuseIndex/3));
 vec2 uv=(cell*musicDiffuseFieldSize+musicDiffuseUV*(musicDiffuseFieldSize-1.)+.5)/(3.*musicDiffuseFieldSize);
 vec3 f=texture2D(musicDiffuseField,uv).xyz;
 float len=length(f);return vec3(max((len*len+dot(musicDiffuseNormal,f))/(len+1.),0.));
}
#endif
void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
 if(all(equal(rectAreaLight.color,vec3(0.))))return;

		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		mat3 mInv = musicLTCInverse;
		vec3 fresnel = musicLTCFresnel;

musicLTCActiveTransform = musicLTCSpecularTransform;
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
musicLTCActiveTransform = musicLTCDiffuseTransform;
#ifdef MUSIC_DIFFUSE_FIELD
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * musicDiffuseLTC( normal, viewDir, position, rectCoords );
#else
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
#endif
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			mat3 mInvClearcoat = musicLTCClearcoatInverse;
			vec3 fresnelClearcoat = musicLTCClearcoatFresnel;

musicLTCActiveTransform = musicLTCClearcoatTransform;
#ifndef MUSIC_CLEARCOAT_FIELD
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
#endif
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}
#else
uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}
#endif
`,Nh=`#ifdef MUSIC_RECT_LTC_SHARED

vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	MusicPrepareRectLTCShared( geometryNormal, geometryViewDir, geometryClearcoatNormal, material );
#ifdef MUSIC_DIFFUSE_FIELD
musicPrepareDiffuseField(geometryPosition,geometryNormal);
#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
#ifdef MUSIC_DIFFUSE_FIELD
musicDiffuseIndex = UNROLLED_LOOP_INDEX;
#endif
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#if defined(MUSIC_CLEARCOAT_FIELD) && defined(USE_CLEARCOAT)
 clearcoatSpecularDirect+=texture2D(musicClearcoatField,musicDiffuseUV).rgb;
#endif

#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif
#else

vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif
#endif
`,Uh=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Oh=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Bh=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Gh=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Vh=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zh=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Hh=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,kh=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Wh=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Xh=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,qh=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Yh=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Zh=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Jh=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Kh=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,$h=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Qh=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,jh=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,eu=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,tu=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,nu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,iu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ru=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,su=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,au=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ou=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,lu=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,cu=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,hu=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,uu=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,fu=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,du=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,pu=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,mu=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,gu=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,_u=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,vu=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,xu=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Su=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Mu=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,yu=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Eu=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Tu=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,bu=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Au=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ru=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Cu=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,wu=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Pu=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Lu=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Du=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Iu=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Fu=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Nu=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Uu=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ou=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bu=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Gu=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vu=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,zu=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hu=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,ku=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Wu=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Xu=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,qu=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Yu=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zu=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ju=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ku=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,$u=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Qu=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ju=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ef=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,tf=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,nf=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,rf=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,sf=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,af=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,of=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,lf=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cf=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hf=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,uf=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,ff=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,df=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,pf=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,mf=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,gf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ke={alphahash_fragment:Uc,alphahash_pars_fragment:Oc,alphamap_fragment:Bc,alphamap_pars_fragment:Gc,alphatest_fragment:Vc,alphatest_pars_fragment:zc,aomap_fragment:Hc,aomap_pars_fragment:kc,batching_pars_vertex:Wc,batching_vertex:Xc,begin_vertex:qc,beginnormal_vertex:Yc,bsdfs:Zc,iridescence_fragment:Jc,bumpmap_pars_fragment:Kc,clipping_planes_fragment:$c,clipping_planes_pars_fragment:Qc,clipping_planes_pars_vertex:jc,clipping_planes_vertex:eh,color_fragment:th,color_pars_fragment:nh,color_pars_vertex:ih,color_vertex:rh,common:sh,cube_uv_reflection_fragment:ah,defaultnormal_vertex:oh,displacementmap_pars_vertex:lh,displacementmap_vertex:ch,emissivemap_fragment:hh,emissivemap_pars_fragment:uh,colorspace_fragment:fh,colorspace_pars_fragment:dh,envmap_fragment:ph,envmap_common_pars_fragment:mh,envmap_pars_fragment:gh,envmap_pars_vertex:_h,envmap_physical_pars_fragment:Ch,envmap_vertex:vh,fog_vertex:xh,fog_pars_vertex:Sh,fog_fragment:Mh,fog_pars_fragment:yh,gradientmap_pars_fragment:Eh,lightmap_pars_fragment:Th,lights_lambert_fragment:bh,lights_lambert_pars_fragment:Ah,lights_pars_begin:Rh,lights_toon_fragment:wh,lights_toon_pars_fragment:Ph,lights_phong_fragment:Lh,lights_phong_pars_fragment:Dh,lights_physical_fragment:Ih,lights_physical_pars_fragment:Fh,lights_fragment_begin:Nh,lights_fragment_maps:Uh,lights_fragment_end:Oh,lightprobes_pars_fragment:Bh,logdepthbuf_fragment:Gh,logdepthbuf_pars_fragment:Vh,logdepthbuf_pars_vertex:zh,logdepthbuf_vertex:Hh,map_fragment:kh,map_pars_fragment:Wh,map_particle_fragment:Xh,map_particle_pars_fragment:qh,metalnessmap_fragment:Yh,metalnessmap_pars_fragment:Zh,morphinstance_vertex:Jh,morphcolor_vertex:Kh,morphnormal_vertex:$h,morphtarget_pars_vertex:Qh,morphtarget_vertex:jh,normal_fragment_begin:eu,normal_fragment_maps:tu,normal_pars_fragment:nu,normal_pars_vertex:iu,normal_vertex:ru,normalmap_pars_fragment:su,clearcoat_normal_fragment_begin:au,clearcoat_normal_fragment_maps:ou,clearcoat_pars_fragment:lu,iridescence_pars_fragment:cu,opaque_fragment:hu,packing:uu,premultiplied_alpha_fragment:fu,project_vertex:du,dithering_fragment:pu,dithering_pars_fragment:mu,roughnessmap_fragment:gu,roughnessmap_pars_fragment:_u,shadowmap_pars_fragment:vu,shadowmap_pars_vertex:xu,shadowmap_vertex:Su,shadowmask_pars_fragment:Mu,skinbase_vertex:yu,skinning_pars_vertex:Eu,skinning_vertex:Tu,skinnormal_vertex:bu,specularmap_fragment:Au,specularmap_pars_fragment:Ru,tonemapping_fragment:Cu,tonemapping_pars_fragment:wu,transmission_fragment:Pu,transmission_pars_fragment:Lu,uv_pars_fragment:Du,uv_pars_vertex:Iu,uv_vertex:Fu,worldpos_vertex:Nu,background_vert:Uu,background_frag:Ou,backgroundCube_vert:Bu,backgroundCube_frag:Gu,cube_vert:Vu,cube_frag:zu,depth_vert:Hu,depth_frag:ku,distance_vert:Wu,distance_frag:Xu,equirect_vert:qu,equirect_frag:Yu,linedashed_vert:Zu,linedashed_frag:Ju,meshbasic_vert:Ku,meshbasic_frag:$u,meshlambert_vert:Qu,meshlambert_frag:ju,meshmatcap_vert:ef,meshmatcap_frag:tf,meshnormal_vert:nf,meshnormal_frag:rf,meshphong_vert:sf,meshphong_frag:af,meshphysical_vert:of,meshphysical_frag:lf,meshtoon_vert:cf,meshtoon_frag:hf,points_vert:uf,points_frag:ff,shadow_vert:df,shadow_frag:pf,sprite_vert:mf,sprite_frag:gf},Se={common:{diffuse:{value:new Ye(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qe}},envmap:{envMap:{value:null},envMapRotation:{value:new qe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qe},normalScale:{value:new le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ye(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new D},probesMax:{value:new D},probesResolution:{value:new D}},points:{diffuse:{value:new Ye(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0},uvTransform:{value:new qe}},sprite:{diffuse:{value:new Ye(16777215)},opacity:{value:1},center:{value:new le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}}},Jt={basic:{uniforms:Lt([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.fog]),vertexShader:Ke.meshbasic_vert,fragmentShader:Ke.meshbasic_frag},lambert:{uniforms:Lt([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new Ye(0)},envMapIntensity:{value:1}}]),vertexShader:Ke.meshlambert_vert,fragmentShader:Ke.meshlambert_frag},phong:{uniforms:Lt([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new Ye(0)},specular:{value:new Ye(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphong_vert,fragmentShader:Ke.meshphong_frag},standard:{uniforms:Lt([Se.common,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.roughnessmap,Se.metalnessmap,Se.fog,Se.lights,{emissive:{value:new Ye(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag},toon:{uniforms:Lt([Se.common,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.gradientmap,Se.fog,Se.lights,{emissive:{value:new Ye(0)}}]),vertexShader:Ke.meshtoon_vert,fragmentShader:Ke.meshtoon_frag},matcap:{uniforms:Lt([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,{matcap:{value:null}}]),vertexShader:Ke.meshmatcap_vert,fragmentShader:Ke.meshmatcap_frag},points:{uniforms:Lt([Se.points,Se.fog]),vertexShader:Ke.points_vert,fragmentShader:Ke.points_frag},dashed:{uniforms:Lt([Se.common,Se.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ke.linedashed_vert,fragmentShader:Ke.linedashed_frag},depth:{uniforms:Lt([Se.common,Se.displacementmap]),vertexShader:Ke.depth_vert,fragmentShader:Ke.depth_frag},normal:{uniforms:Lt([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,{opacity:{value:1}}]),vertexShader:Ke.meshnormal_vert,fragmentShader:Ke.meshnormal_frag},sprite:{uniforms:Lt([Se.sprite,Se.fog]),vertexShader:Ke.sprite_vert,fragmentShader:Ke.sprite_frag},background:{uniforms:{uvTransform:{value:new qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ke.background_vert,fragmentShader:Ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qe}},vertexShader:Ke.backgroundCube_vert,fragmentShader:Ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ke.cube_vert,fragmentShader:Ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ke.equirect_vert,fragmentShader:Ke.equirect_frag},distance:{uniforms:Lt([Se.common,Se.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ke.distance_vert,fragmentShader:Ke.distance_frag},shadow:{uniforms:Lt([Se.lights,Se.fog,{color:{value:new Ye(0)},opacity:{value:1}}]),vertexShader:Ke.shadow_vert,fragmentShader:Ke.shadow_frag}};Jt.physical={uniforms:Lt([Jt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qe},clearcoatNormalScale:{value:new le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qe},sheen:{value:0},sheenColor:{value:new Ye(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qe},transmissionSamplerSize:{value:new le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qe},attenuationDistance:{value:0},attenuationColor:{value:new Ye(0)},specularColor:{value:new Ye(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qe},anisotropyVector:{value:new le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qe}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag};const cr={r:0,b:0,g:0},_f=new ot,Ao=new qe;Ao.set(-1,0,0,0,1,0,0,0,1);function vf(i,e,t,n,r,s){const a=new Ye(0);let o=r===!0?0:1,l,c,u=null,f=0,h=null;function d(y){let E=y.isScene===!0?y.background:null;if(E&&E.isTexture){const v=y.backgroundBlurriness>0;E=e.get(E,v)}return E}function g(y){let E=!1;const v=d(y);v===null?m(a,o):v&&v.isColor&&(m(v,1),E=!0);const R=i.xr.getEnvironmentBlendMode();R==="additive"?t.buffers.color.setClear(0,0,0,1,s):R==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(i.autoClear||E)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function M(y,E){const v=d(E);v&&(v.isCubeTexture||v.mapping===306)?(c===void 0&&(c=new Dt(new Ii(1,1,1),new $t({name:"BackgroundCubeMaterial",uniforms:li(Jt.backgroundCube.uniforms),vertexShader:Jt.backgroundCube.vertexShader,fragmentShader:Jt.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(R,T,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(_f.makeRotationFromEuler(E.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Ao),c.material.toneMapped=et.getTransfer(v.colorSpace)!==lt,(u!==v||f!==v.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,u=v,f=v.version,h=i.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new Dt(new vr(2,2),new $t({name:"BackgroundMaterial",uniforms:li(Jt.background.uniforms),vertexShader:Jt.background.vertexShader,fragmentShader:Jt.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.toneMapped=et.getTransfer(v.colorSpace)!==lt,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||f!==v.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,u=v,f=v.version,h=i.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function m(y,E){y.getRGB(cr,Mo(i)),t.buffers.color.setClear(cr.r,cr.g,cr.b,E,s)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,E=1){a.set(y),o=E,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,m(a,o)},render:g,addToRenderList:M,dispose:p}}function xf(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=h(null);let s=r,a=!1;function o(F,U,k,W,V){let H=!1;const z=f(F,W,k,U);s!==z&&(s=z,c(s.object)),H=d(F,W,k,V),H&&g(F,W,k,V),V!==null&&e.update(V,i.ELEMENT_ARRAY_BUFFER),(H||a)&&(a=!1,v(F,U,k,W),V!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return i.createVertexArray()}function c(F){return i.bindVertexArray(F)}function u(F){return i.deleteVertexArray(F)}function f(F,U,k,W){const V=W.wireframe===!0;let H=n[U.id];H===void 0&&(H={},n[U.id]=H);const z=F.isInstancedMesh===!0?F.id:0;let Q=H[z];Q===void 0&&(Q={},H[z]=Q);let se=Q[k.id];se===void 0&&(se={},Q[k.id]=se);let ce=se[V];return ce===void 0&&(ce=h(l()),se[V]=ce),ce}function h(F){const U=[],k=[],W=[];for(let V=0;V<t;V++)U[V]=0,k[V]=0,W[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:k,attributeDivisors:W,object:F,attributes:{},index:null}}function d(F,U,k,W){const V=s.attributes,H=U.attributes;let z=0;const Q=k.getAttributes();for(const se in Q)if(Q[se].location>=0){const me=V[se];let Re=H[se];if(Re===void 0&&(se==="instanceMatrix"&&F.instanceMatrix&&(Re=F.instanceMatrix),se==="instanceColor"&&F.instanceColor&&(Re=F.instanceColor)),me===void 0||me.attribute!==Re||Re&&me.data!==Re.data)return!0;z++}return s.attributesNum!==z||s.index!==W}function g(F,U,k,W){const V={},H=U.attributes;let z=0;const Q=k.getAttributes();for(const se in Q)if(Q[se].location>=0){let me=H[se];me===void 0&&(se==="instanceMatrix"&&F.instanceMatrix&&(me=F.instanceMatrix),se==="instanceColor"&&F.instanceColor&&(me=F.instanceColor));const Re={};Re.attribute=me,me&&me.data&&(Re.data=me.data),V[se]=Re,z++}s.attributes=V,s.attributesNum=z,s.index=W}function M(){const F=s.newAttributes;for(let U=0,k=F.length;U<k;U++)F[U]=0}function m(F){p(F,0)}function p(F,U){const k=s.newAttributes,W=s.enabledAttributes,V=s.attributeDivisors;k[F]=1,W[F]===0&&(i.enableVertexAttribArray(F),W[F]=1),V[F]!==U&&(i.vertexAttribDivisor(F,U),V[F]=U)}function y(){const F=s.newAttributes,U=s.enabledAttributes;for(let k=0,W=U.length;k<W;k++)U[k]!==F[k]&&(i.disableVertexAttribArray(k),U[k]=0)}function E(F,U,k,W,V,H,z){z===!0?i.vertexAttribIPointer(F,U,k,V,H):i.vertexAttribPointer(F,U,k,W,V,H)}function v(F,U,k,W){M();const V=W.attributes,H=k.getAttributes(),z=U.defaultAttributeValues;for(const Q in H){const se=H[Q];if(se.location>=0){let ce=V[Q];if(ce===void 0&&(Q==="instanceMatrix"&&F.instanceMatrix&&(ce=F.instanceMatrix),Q==="instanceColor"&&F.instanceColor&&(ce=F.instanceColor)),ce!==void 0){const me=ce.normalized,Re=ce.itemSize,Qe=e.get(ce);if(Qe===void 0)continue;const st=Qe.buffer,it=Qe.type,K=Qe.bytesPerElement,_e=it===i.INT||it===i.UNSIGNED_INT||ce.gpuType===1013;if(ce.isInterleavedBufferAttribute){const fe=ce.data,Ne=fe.stride,He=ce.offset;if(fe.isInstancedInterleavedBuffer){for(let Ge=0;Ge<se.locationSize;Ge++)p(se.location+Ge,fe.meshPerAttribute);F.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let Ge=0;Ge<se.locationSize;Ge++)m(se.location+Ge);i.bindBuffer(i.ARRAY_BUFFER,st);for(let Ge=0;Ge<se.locationSize;Ge++)E(se.location+Ge,Re/se.locationSize,it,me,Ne*K,(He+Re/se.locationSize*Ge)*K,_e)}else{if(ce.isInstancedBufferAttribute){for(let fe=0;fe<se.locationSize;fe++)p(se.location+fe,ce.meshPerAttribute);F.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let fe=0;fe<se.locationSize;fe++)m(se.location+fe);i.bindBuffer(i.ARRAY_BUFFER,st);for(let fe=0;fe<se.locationSize;fe++)E(se.location+fe,Re/se.locationSize,it,me,Re*K,Re/se.locationSize*fe*K,_e)}}else if(z!==void 0){const me=z[Q];if(me!==void 0)switch(me.length){case 2:i.vertexAttrib2fv(se.location,me);break;case 3:i.vertexAttrib3fv(se.location,me);break;case 4:i.vertexAttrib4fv(se.location,me);break;default:i.vertexAttrib1fv(se.location,me)}}}}y()}function R(){b();for(const F in n){const U=n[F];for(const k in U){const W=U[k];for(const V in W){const H=W[V];for(const z in H)u(H[z].object),delete H[z];delete W[V]}}delete n[F]}}function T(F){if(n[F.id]===void 0)return;const U=n[F.id];for(const k in U){const W=U[k];for(const V in W){const H=W[V];for(const z in H)u(H[z].object),delete H[z];delete W[V]}}delete n[F.id]}function P(F){for(const U in n){const k=n[U];for(const W in k){const V=k[W];if(V[F.id]===void 0)continue;const H=V[F.id];for(const z in H)u(H[z].object),delete H[z];delete V[F.id]}}}function _(F){for(const U in n){const k=n[U],W=F.isInstancedMesh===!0?F.id:0,V=k[W];if(V!==void 0){for(const H in V){const z=V[H];for(const Q in z)u(z[Q].object),delete z[Q];delete V[H]}delete k[W],Object.keys(k).length===0&&delete n[U]}}}function b(){w(),a=!0,s!==r&&(s=r,c(s.object))}function w(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:b,resetDefaultState:w,dispose:R,releaseStatesOfGeometry:T,releaseStatesOfObject:_,releaseStatesOfProgram:P,initAttributes:M,enableAttribute:m,disableUnusedAttributes:y}}function Sf(i,e,t){let n;function r(l){n=l}function s(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,u){u!==0&&(i.drawArraysInstanced(n,l,c,u),t.update(c,n,u))}function o(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let h=0;for(let d=0;d<u;d++)h+=c[d];t.update(h,n,1)}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function Mf(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(P){return!(P!==1023&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const _=P===1016&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==1009&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==1015&&!_)}function l(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(Oe("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const f=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&Oe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),R=i.getParameter(i.MAX_SAMPLES),T=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:h,maxTextures:d,maxVertexTextures:g,maxTextureSize:M,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:y,maxVaryings:E,maxFragmentUniforms:v,maxSamples:R,samples:T}}function yf(i){const e=this;let t=null,n=0,r=!1,s=!1;const a=new wn,o=new qe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const d=f.length!==0||h||n!==0||r;return r=h,n=f.length,d},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,h){t=u(f,h,0)},this.setState=function(f,h,d){const g=f.clippingPlanes,M=f.clipIntersection,m=f.clipShadows,p=i.get(f);if(!r||g===null||g.length===0||s&&!m)s?u(null):c();else{const y=s?0:n,E=y*4;let v=p.clippingState||null;l.value=v,v=u(g,h,E,d);for(let R=0;R!==E;++R)v[R]=t[R];p.clippingState=v,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(f,h,d,g){const M=f!==null?f.length:0;let m=null;if(M!==0){if(m=l.value,g!==!0||m===null){const p=d+M*4,y=h.matrixWorldInverse;o.getNormalMatrix(y),(m===null||m.length<p)&&(m=new Float32Array(p));for(let E=0,v=d;E!==M;++E,v+=4)a.copy(f[E]).applyMatrix4(y,o),a.normal.toArray(m,v),m[v+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,m}}const En=4,Ta=[.125,.215,.35,.446,.526,.582],Pn=20,Ef=256,Si=new _s,ba=new Ye;let jr=null,es=0,ts=0,ns=!1;const Tf=new D;class Aa{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,s={}){const{size:a=256,position:o=Tf}=s;jr=this._renderer.getRenderTarget(),es=this._renderer.getActiveCubeFace(),ts=this._renderer.getActiveMipmapLevel(),ns=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,r,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wa(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ca(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(jr,es,ts),this._renderer.xr.enabled=ns,e.scissorTest=!1,ti(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),jr=this._renderer.getRenderTarget(),es=this._renderer.getActiveCubeFace(),ts=this._renderer.getActiveMipmapLevel(),ns=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:1006,minFilter:1006,generateMipmaps:!1,type:1016,format:1023,colorSpace:fr,depthBuffer:!1},r=Ra(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ra(e,t,n);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=bf(s)),this._blurMaterial=Rf(s,e,t),this._ggxMaterial=Af(s,e,t)}return r}_compileMaterial(e){const t=new Dt(new Mt,e);this._renderer.compile(t,Si)}_sceneToCubeUV(e,t,n,r,s){const l=new Vt(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,h=f.autoClear,d=f.toneMapping;f.getClearColor(ba),f.toneMapping=0,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(r),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Dt(new Ii,new ii({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1})));const M=this._backgroundBox,m=M.material;let p=!1;const y=e.background;y?y.isColor&&(m.color.copy(y),e.background=null,p=!0):(m.color.copy(ba),p=!0);for(let E=0;E<6;E++){const v=E%3;v===0?(l.up.set(0,c[E],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[E],s.y,s.z)):v===1?(l.up.set(0,0,c[E]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[E],s.z)):(l.up.set(0,c[E],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[E]));const R=this._cubeSize;ti(r,v*R,E>2?R:0,R,R),f.setRenderTarget(r),p&&f.render(M,l),f.render(e,l)}f.toneMapping=d,f.autoClear=h,e.background=y}_textureToCubeUV(e,t){const n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=wa()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ca());const s=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;const o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;ti(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Si)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=n}_applyGGXFilter(e,t,n){const r=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),f=Math.sqrt(c*c-u*u),h=0+c*1.25,d=f*h,{_lodMax:g}=this,M=this._sizeLods[n],m=3*M*(n>g-En?n-g+En:0),p=4*(this._cubeSize-M);l.envMap.value=e.texture,l.roughness.value=d,l.mipInt.value=g-t,ti(s,m,p,3*M,2*M),r.setRenderTarget(s),r.render(o,Si),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=g-n,ti(e,m,p,3*M,2*M),r.setRenderTarget(e),r.render(o,Si)}_blur(e,t,n,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,"latitudinal",s),this._halfBlur(a,e,n,n,r,"longitudinal",s)}_halfBlur(e,t,n,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&je("blur direction must be either latitudinal or longitudinal!");const u=3,f=this._lodMeshes[r];f.material=c;const h=c.uniforms,d=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*d):2*Math.PI/(2*Pn-1),M=s/g,m=isFinite(s)?1+Math.floor(u*M):Pn;m>Pn&&Oe(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Pn}`);const p=[];let y=0;for(let P=0;P<Pn;++P){const _=P/M,b=Math.exp(-_*_/2);p.push(b),P===0?y+=b:P<m&&(y+=2*b)}for(let P=0;P<p.length;P++)p[P]=p[P]/y;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=p,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:E}=this;h.dTheta.value=g,h.mipInt.value=E-n;const v=this._sizeLods[r],R=3*v*(r>E-En?r-E+En:0),T=4*(this._cubeSize-v);ti(t,R,T,3*v,2*v),l.setRenderTarget(t),l.render(f,Si)}}function bf(i){const e=[],t=[],n=[];let r=i;const s=i-En+1+Ta.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let l=1/o;a>i-En?l=Ta[a-i+En-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),u=-c,f=1+c,h=[u,u,f,u,f,f,u,u,f,f,u,f],d=6,g=6,M=3,m=2,p=1,y=new Float32Array(M*g*d),E=new Float32Array(m*g*d),v=new Float32Array(p*g*d);for(let T=0;T<d;T++){const P=T%3*2/3-1,_=T>2?0:-1,b=[P,_,0,P+2/3,_,0,P+2/3,_+1,0,P,_,0,P+2/3,_+1,0,P,_+1,0];y.set(b,M*g*T),E.set(h,m*g*T);const w=[T,T,T,T,T,T];v.set(w,p*g*T)}const R=new Mt;R.setAttribute("position",new Xt(y,M)),R.setAttribute("uv",new Xt(E,m)),R.setAttribute("faceIndex",new Xt(v,p)),n.push(new Dt(R,null)),r>En&&r--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function Ra(i,e,t){const n=new Kt(i,e,t);return n.texture.mapping=306,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ti(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function Af(i,e,t){return new $t({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Ef,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Sr(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Rf(i,e,t){const n=new Float32Array(Pn),r=new D(0,1,0);return new $t({name:"SphericalGaussianBlur",defines:{n:Pn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Sr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ca(){return new $t({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Sr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function wa(){return new $t({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Sr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Sr(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class Ro extends Kt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new ja(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Ii(5,5,5),s=new $t({name:"CubemapFromEquirect",uniforms:li(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});s.uniforms.tEquirect.value=t;const a=new Dt(r,s),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=1006),new wc(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,r);e.setRenderTarget(s)}}function Cf(i){let e=new WeakMap,t=new WeakMap,n=null;function r(h,d=!1){return h==null?null:d?a(h):s(h)}function s(h){if(h&&h.isTexture){const d=h.mapping;if(d===303||d===304)if(e.has(h)){const g=e.get(h).texture;return o(g,h.mapping)}else{const g=h.image;if(g&&g.height>0){const M=new Ro(g.height);return M.fromEquirectangularTexture(i,h),e.set(h,M),h.addEventListener("dispose",c),o(M.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){const d=h.mapping,g=d===303||d===304,M=d===301||d===302;if(g||M){let m=t.get(h);const p=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return n===null&&(n=new Aa(i)),m=g?n.fromEquirectangular(h,m):n.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),m.texture;if(m!==void 0)return m.texture;{const y=h.image;return g&&y&&y.height>0||M&&y&&l(y)?(n===null&&(n=new Aa(i)),m=g?n.fromEquirectangular(h):n.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),h.addEventListener("dispose",u),m.texture):null}}}return h}function o(h,d){return d===303?h.mapping=301:d===304&&(h.mapping=302),h}function l(h){let d=0;const g=6;for(let M=0;M<g;M++)h[M]!==void 0&&d++;return d===g}function c(h){const d=h.target;d.removeEventListener("dispose",c);const g=e.get(d);g!==void 0&&(e.delete(d),g.dispose())}function u(h){const d=h.target;d.removeEventListener("dispose",u);const g=t.get(d);g!==void 0&&(t.delete(d),g.dispose())}function f(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:r,dispose:f}}function wf(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const r=i.getExtension(n);return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const r=t(n);return r===null&&ri("WebGLRenderer: "+n+" extension not supported."),r}}}function Pf(i,e,t,n){const r={},s=new WeakMap;function a(f){const h=f.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",a),delete r[h.id];const d=s.get(h);d&&(e.remove(d),s.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(f,h){return r[h.id]===!0||(h.addEventListener("dispose",a),r[h.id]=!0,t.memory.geometries++),h}function l(f){const h=f.attributes;for(const d in h)e.update(h[d],i.ARRAY_BUFFER)}function c(f){const h=[],d=f.index,g=f.attributes.position;let M=0;if(g===void 0)return;if(d!==null){const y=d.array;M=d.version;for(let E=0,v=y.length;E<v;E+=3){const R=y[E+0],T=y[E+1],P=y[E+2];h.push(R,T,T,P,P,R)}}else{const y=g.array;M=g.version;for(let E=0,v=y.length/3-1;E<v;E+=3){const R=E+0,T=E+1,P=E+2;h.push(R,T,T,P,P,R)}}const m=new(g.count>=65535?Qa:$a)(h,1);m.version=M;const p=s.get(f);p&&e.remove(p),s.set(f,m)}function u(f){const h=s.get(f);if(h){const d=f.index;d!==null&&h.version<d.version&&c(f)}else c(f);return s.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function Lf(i,e,t){let n;function r(f){n=f}let s,a;function o(f){s=f.type,a=f.bytesPerElement}function l(f,h){i.drawElements(n,h,s,f*a),t.update(h,n,1)}function c(f,h,d){d!==0&&(i.drawElementsInstanced(n,h,s,f*a,d),t.update(h,n,d))}function u(f,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,s,f,0,d);let M=0;for(let m=0;m<d;m++)M+=h[m];t.update(M,n,1)}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function Df(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(s/3);break;case i.LINES:t.lines+=o*(s/2);break;case i.LINE_STRIP:t.lines+=o*(s-1);break;case i.LINE_LOOP:t.lines+=o*s;break;case i.POINTS:t.points+=o*s;break;default:je("WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function If(i,e,t){const n=new WeakMap,r=new dt;function s(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=u!==void 0?u.length:0;let h=n.get(o);if(h===void 0||h.count!==f){let b=function(){P.dispose(),n.delete(o),o.removeEventListener("dispose",b)};h!==void 0&&h.texture.dispose();const d=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,M=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let E=0;d===!0&&(E=1),g===!0&&(E=2),M===!0&&(E=3);let v=o.attributes.position.count*E,R=1;v>e.maxTextureSize&&(R=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);const T=new Float32Array(v*R*4*f),P=new Za(T,v,R,f);P.type=1015,P.needsUpdate=!0;const _=E*4;for(let w=0;w<f;w++){const F=m[w],U=p[w],k=y[w],W=v*R*4*w;for(let V=0;V<F.count;V++){const H=V*_;d===!0&&(r.fromBufferAttribute(F,V),T[W+H+0]=r.x,T[W+H+1]=r.y,T[W+H+2]=r.z,T[W+H+3]=0),g===!0&&(r.fromBufferAttribute(U,V),T[W+H+4]=r.x,T[W+H+5]=r.y,T[W+H+6]=r.z,T[W+H+7]=0),M===!0&&(r.fromBufferAttribute(k,V),T[W+H+8]=r.x,T[W+H+9]=r.y,T[W+H+10]=r.z,T[W+H+11]=k.itemSize===4?r.w:1)}}h={count:f,texture:P,size:new le(v,R)},n.set(o,h),o.addEventListener("dispose",b)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let d=0;for(let M=0;M<c.length;M++)d+=c[M];const g=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:s}}function Ff(i,e,t,n,r){let s=new WeakMap;function a(c){const u=r.render.frame,f=c.geometry,h=e.get(c,f);if(s.get(h)!==u&&(e.update(h),s.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==u&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,u))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==u&&(d.update(),s.set(d,u))}return h}function o(){s=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}const Nf={1:"LINEAR_TONE_MAPPING",2:"REINHARD_TONE_MAPPING",3:"CINEON_TONE_MAPPING",4:"ACES_FILMIC_TONE_MAPPING",6:"AGX_TONE_MAPPING",7:"NEUTRAL_TONE_MAPPING",5:"CUSTOM_TONE_MAPPING"};function Uf(i,e,t,n,r,s){const a=new Kt(e,t,{type:i,depthBuffer:r,stencilBuffer:s,samples:n?4:0,depthTexture:r?new ai(e,t):void 0}),o=new Kt(e,t,{type:1016,depthBuffer:!1,stencilBuffer:!1}),l=new Mt;l.setAttribute("position",new $e([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new $e([0,2,0,0,2,0],2));const c=new vc({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new Dt(l,c),f=new _s(-1,1,1,-1,0,1);let h=null,d=null,g=!1,M,m=null,p=[],y=!1;this.setSize=function(E,v){a.setSize(E,v),o.setSize(E,v);for(let R=0;R<p.length;R++){const T=p[R];T.setSize&&T.setSize(E,v)}},this.setEffects=function(E){p=E,y=p.length>0&&p[0].isRenderPass===!0;const v=a.width,R=a.height;for(let T=0;T<p.length;T++){const P=p[T];P.setSize&&P.setSize(v,R)}},this.begin=function(E,v){if(g||E.toneMapping===0&&p.length===0)return!1;if(m=v,v!==null){const R=v.width,T=v.height;(a.width!==R||a.height!==T)&&this.setSize(R,T)}return y===!1&&E.setRenderTarget(a),M=E.toneMapping,E.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(E,v){E.toneMapping=M,g=!0;let R=a,T=o;for(let P=0;P<p.length;P++){const _=p[P];if(_.enabled!==!1&&(_.render(E,T,R,v),_.needsSwap!==!1)){const b=R;R=T,T=b}}if(h!==E.outputColorSpace||d!==E.toneMapping){h=E.outputColorSpace,d=E.toneMapping,c.defines={},et.getTransfer(h)===lt&&(c.defines.SRGB_TRANSFER="");const P=Nf[d];P&&(c.defines[P]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=R.texture,E.setRenderTarget(m),E.render(u,f),m=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}const Co=new Rt,ls=new ai(1,1),wo=new Za,Po=new ul,Lo=new ja,Pa=[],La=[],Da=new Float32Array(16),Ia=new Float32Array(9),Fa=new Float32Array(4);function ui(i,e,t){const n=i[0];if(n<=0||n>0)return i;const r=e*t;let s=Pa[r];if(s===void 0&&(s=new Float32Array(r),Pa[r]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(s,o)}return s}function Et(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Tt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Mr(i,e){let t=La[e];t===void 0&&(t=new Int32Array(e),La[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Of(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Bf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;i.uniform2fv(this.addr,e),Tt(t,e)}}function Gf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Et(t,e))return;i.uniform3fv(this.addr,e),Tt(t,e)}}function Vf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;i.uniform4fv(this.addr,e),Tt(t,e)}}function zf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Et(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Tt(t,e)}else{if(Et(t,n))return;Fa.set(n),i.uniformMatrix2fv(this.addr,!1,Fa),Tt(t,n)}}function Hf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Et(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Tt(t,e)}else{if(Et(t,n))return;Ia.set(n),i.uniformMatrix3fv(this.addr,!1,Ia),Tt(t,n)}}function kf(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Et(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Tt(t,e)}else{if(Et(t,n))return;Da.set(n),i.uniformMatrix4fv(this.addr,!1,Da),Tt(t,n)}}function Wf(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Xf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;i.uniform2iv(this.addr,e),Tt(t,e)}}function qf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Et(t,e))return;i.uniform3iv(this.addr,e),Tt(t,e)}}function Yf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;i.uniform4iv(this.addr,e),Tt(t,e)}}function Zf(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Jf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;i.uniform2uiv(this.addr,e),Tt(t,e)}}function Kf(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Et(t,e))return;i.uniform3uiv(this.addr,e),Tt(t,e)}}function $f(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;i.uniform4uiv(this.addr,e),Tt(t,e)}}function Qf(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(ls.compareFunction=t.isReversedDepthBuffer()?518:515,s=ls):s=Co,t.setTexture2D(e||s,r)}function jf(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||Po,r)}function ed(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||Lo,r)}function td(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||wo,r)}function nd(i){switch(i){case 5126:return Of;case 35664:return Bf;case 35665:return Gf;case 35666:return Vf;case 35674:return zf;case 35675:return Hf;case 35676:return kf;case 5124:case 35670:return Wf;case 35667:case 35671:return Xf;case 35668:case 35672:return qf;case 35669:case 35673:return Yf;case 5125:return Zf;case 36294:return Jf;case 36295:return Kf;case 36296:return $f;case 35678:case 36198:case 36298:case 36306:case 35682:return Qf;case 35679:case 36299:case 36307:return jf;case 35680:case 36300:case 36308:case 36293:return ed;case 36289:case 36303:case 36311:case 36292:return td}}function id(i,e){i.uniform1fv(this.addr,e)}function rd(i,e){const t=ui(e,this.size,2);i.uniform2fv(this.addr,t)}function sd(i,e){const t=ui(e,this.size,3);i.uniform3fv(this.addr,t)}function ad(i,e){const t=ui(e,this.size,4);i.uniform4fv(this.addr,t)}function od(i,e){const t=ui(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function ld(i,e){const t=ui(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function cd(i,e){const t=ui(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function hd(i,e){i.uniform1iv(this.addr,e)}function ud(i,e){i.uniform2iv(this.addr,e)}function fd(i,e){i.uniform3iv(this.addr,e)}function dd(i,e){i.uniform4iv(this.addr,e)}function pd(i,e){i.uniform1uiv(this.addr,e)}function md(i,e){i.uniform2uiv(this.addr,e)}function gd(i,e){i.uniform3uiv(this.addr,e)}function _d(i,e){i.uniform4uiv(this.addr,e)}function vd(i,e,t){const n=this.cache,r=e.length,s=Mr(t,r);Et(n,s)||(i.uniform1iv(this.addr,s),Tt(n,s));let a;this.type===i.SAMPLER_2D_SHADOW?a=ls:a=Co;for(let o=0;o!==r;++o)t.setTexture2D(e[o]||a,s[o])}function xd(i,e,t){const n=this.cache,r=e.length,s=Mr(t,r);Et(n,s)||(i.uniform1iv(this.addr,s),Tt(n,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||Po,s[a])}function Sd(i,e,t){const n=this.cache,r=e.length,s=Mr(t,r);Et(n,s)||(i.uniform1iv(this.addr,s),Tt(n,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||Lo,s[a])}function Md(i,e,t){const n=this.cache,r=e.length,s=Mr(t,r);Et(n,s)||(i.uniform1iv(this.addr,s),Tt(n,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||wo,s[a])}function yd(i){switch(i){case 5126:return id;case 35664:return rd;case 35665:return sd;case 35666:return ad;case 35674:return od;case 35675:return ld;case 35676:return cd;case 5124:case 35670:return hd;case 35667:case 35671:return ud;case 35668:case 35672:return fd;case 35669:case 35673:return dd;case 5125:return pd;case 36294:return md;case 36295:return gd;case 36296:return _d;case 35678:case 36198:case 36298:case 36306:case 35682:return vd;case 35679:case 36299:case 36307:return xd;case 35680:case 36300:case 36308:case 36293:return Sd;case 36289:case 36303:case 36311:case 36292:return Md}}class Ed{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=nd(t.type)}}class Td{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=yd(t.type)}}class bd{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],n)}}}const is=/(\w+)(\])?(\[|\.)?/g;function Na(i,e){i.seq.push(e),i.map[e.id]=e}function Ad(i,e,t){const n=i.name,r=n.length;for(is.lastIndex=0;;){const s=is.exec(n),a=is.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){Na(t,c===void 0?new Ed(o,i,e):new Td(o,i,e));break}else{let f=t.map[o];f===void 0&&(f=new bd(o),Na(t,f)),t=f}}}class ur{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);Ad(o,l,this)}const r=[],s=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(a):s.push(a);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,n,r){const s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){const r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const n=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&n.push(a)}return n}}function Ua(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Rd=37297;let Cd=0;function wd(i,e){const t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const Oa=new qe;function Pd(i){et._getMatrix(Oa,et.workingColorSpace,i);const e=`mat3( ${Oa.elements.map(t=>t.toFixed(4))} )`;switch(et.getTransfer(i)){case dr:return[e,"LinearTransferOETF"];case lt:return[e,"sRGBTransferOETF"];default:return Oe("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Ba(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=(i.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+wd(i.getShaderSource(e),o)}else return s}function Ld(i,e){const t=Pd(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Dd={1:"Linear",2:"Reinhard",3:"Cineon",4:"ACESFilmic",6:"AgX",7:"Neutral",5:"Custom"};function Id(i,e){const t=Dd[e];return t===void 0?(Oe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const hr=new D;function Fd(){et.getLuminanceCoefficients(hr);const i=hr.x.toFixed(4),e=hr.y.toFixed(4),t=hr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Nd(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ei).join(`
`)}function Ud(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Od(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(e,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Ei(i){return i!==""}function Ga(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Va(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Bd=/^[ \t]*#include +<([\w\d./]+)>/gm;function cs(i){return i.replace(Bd,Vd)}const Gd=new Map;function Vd(i,e){let t=Ke[e];if(t===void 0){const n=Gd.get(e);if(n!==void 0)t=Ke[n],Oe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return cs(t)}const zd=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function za(i){return i.replace(zd,Hd)}function Hd(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Ha(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const kd={1:"SHADOWMAP_TYPE_PCF",3:"SHADOWMAP_TYPE_VSM"};function Wd(i){return kd[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Xd={301:"ENVMAP_TYPE_CUBE",302:"ENVMAP_TYPE_CUBE",306:"ENVMAP_TYPE_CUBE_UV"};function qd(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Xd[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const Yd={302:"ENVMAP_MODE_REFRACTION"};function Zd(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Yd[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Jd={0:"ENVMAP_BLENDING_MULTIPLY",1:"ENVMAP_BLENDING_MIX",2:"ENVMAP_BLENDING_ADD"};function Kd(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Jd[i.combine]||"ENVMAP_BLENDING_NONE"}function $d(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Qd(i,e,t,n){const r=i.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Wd(t),c=qd(t),u=Zd(t),f=Kd(t),h=$d(t),d=Nd(t),g=Ud(s),M=r.createProgram();let m,p,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ei).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ei).join(`
`),p.length>0&&(p+=`
`)):(m=[Ha(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ei).join(`
`),p=[Ha(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==0?"#define TONE_MAPPING":"",t.toneMapping!==0?Ke.tonemapping_pars_fragment:"",t.toneMapping!==0?Id("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ke.colorspace_pars_fragment,Ld("linearToOutputTexel",t.outputColorSpace),Fd(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ei).join(`
`)),a=cs(a),a=Ga(a,t),a=Va(a,t),o=cs(o),o=Ga(o,t),o=Va(o,t),a=za(a),o=za(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Ns?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ns?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const E=y+m+a,v=y+p+o,R=Ua(r,r.VERTEX_SHADER,E),T=Ua(r,r.FRAGMENT_SHADER,v);r.attachShader(M,R),r.attachShader(M,T),t.index0AttributeName!==void 0?r.bindAttribLocation(M,0,t.index0AttributeName):t.hasPositionAttribute===!0&&r.bindAttribLocation(M,0,"position"),r.linkProgram(M);function P(F){if(i.debug.checkShaderErrors){const U=r.getProgramInfoLog(M)||"",k=r.getShaderInfoLog(R)||"",W=r.getShaderInfoLog(T)||"",V=U.trim(),H=k.trim(),z=W.trim();let Q=!0,se=!0;if(r.getProgramParameter(M,r.LINK_STATUS)===!1)if(Q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,M,R,T);else{const ce=Ba(r,R,"vertex"),me=Ba(r,T,"fragment");je("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(M,r.VALIDATE_STATUS)+`

Material Name: `+F.name+`
Material Type: `+F.type+`

Program Info Log: `+V+`
`+ce+`
`+me)}else V!==""?Oe("WebGLProgram: Program Info Log:",V):(H===""||z==="")&&(se=!1);se&&(F.diagnostics={runnable:Q,programLog:V,vertexShader:{log:H,prefix:m},fragmentShader:{log:z,prefix:p}})}r.deleteShader(R),r.deleteShader(T),_=new ur(r,M),b=Od(r,M)}let _;this.getUniforms=function(){return _===void 0&&P(this),_};let b;this.getAttributes=function(){return b===void 0&&P(this),b};let w=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=r.getProgramParameter(M,Rd)),w},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Cd++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=R,this.fragmentShader=T,this}let jd=0;class ep{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new tp(e),t.set(e,n)),n}}class tp{constructor(e){this.id=jd++,this.code=e,this.usedTimes=0}}function np(i){return i===1030||i===37490||i===36285}function ip(i,e,t,n,r,s){const a=new Ja,o=new ep,l=new Set,c=[],u=new Map,f=n.logarithmicDepthBuffer;let h=n.precision;const d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return l.add(_),_===0?"uv":`uv${_}`}function M(_,b,w,F,U,k){const W=F.fog,V=U.geometry,H=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?F.environment:null,z=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,Q=e.get(_.envMap||H,z),se=Q&&Q.mapping===306?Q.image.height:null,ce=d[_.type];_.precision!==null&&(h=n.getMaxPrecision(_.precision),h!==_.precision&&Oe("WebGLProgram.getParameters:",_.precision,"not supported, using",h,"instead."));const me=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Re=me!==void 0?me.length:0;let Qe=0;V.morphAttributes.position!==void 0&&(Qe=1),V.morphAttributes.normal!==void 0&&(Qe=2),V.morphAttributes.color!==void 0&&(Qe=3);let st,it,K,_e;if(ce){const Xe=Jt[ce];st=Xe.vertexShader,it=Xe.fragmentShader}else{st=_.vertexShader,it=_.fragmentShader;const Xe=o.getVertexShaderStage(_),mt=o.getFragmentShaderStage(_);o.update(_,Xe,mt),K=Xe.id,_e=mt.id}const fe=i.getRenderTarget(),Ne=i.state.buffers.depth.getReversed(),He=U.isInstancedMesh===!0,Ge=U.isBatchedMesh===!0,ht=!!_.map,Ve=!!_.matcap,j=!!Q,re=!!_.aoMap,ie=!!_.lightMap,Ee=!!_.bumpMap&&_.wireframe===!1,ge=!!_.normalMap,Be=!!_.displacementMap,we=!!_.emissiveMap,Ue=!!_.metalnessMap,We=!!_.roughnessMap,tt=_.anisotropy>0,rt=_.clearcoat>0,pt=_.dispersion>0,A=_.iridescence>0,S=_.sheen>0,B=_.transmission>0,Y=tt&&!!_.anisotropyMap,ne=rt&&!!_.clearcoatMap,he=rt&&!!_.clearcoatNormalMap,ue=rt&&!!_.clearcoatRoughnessMap,X=A&&!!_.iridescenceMap,Z=A&&!!_.iridescenceThicknessMap,Te=S&&!!_.sheenColorMap,C=S&&!!_.sheenRoughnessMap,ye=!!_.specularMap,ae=!!_.specularColorMap,Ie=!!_.specularIntensityMap,J=B&&!!_.transmissionMap,Ze=B&&!!_.thicknessMap,L=!!_.gradientMap,$=!!_.alphaMap,q=_.alphaTest>0,Me=!!_.alphaHash,be=!!_.extensions;let ee=0;_.toneMapped&&(fe===null||fe.isXRRenderTarget===!0)&&(ee=i.toneMapping);const Ae={shaderID:ce,shaderType:_.type,shaderName:_.name,vertexShader:st,fragmentShader:it,defines:_.defines,customVertexShaderID:K,customFragmentShaderID:_e,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:h,batching:Ge,batchingColor:Ge&&U._colorsTexture!==null,instancing:He,instancingColor:He&&U.instanceColor!==null,instancingMorph:He&&U.morphTexture!==null,outputColorSpace:fe===null?i.outputColorSpace:fe.isXRRenderTarget===!0?fe.texture.colorSpace:et.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:ht,matcap:Ve,envMap:j,envMapMode:j&&Q.mapping,envMapCubeUVHeight:se,aoMap:re,lightMap:ie,bumpMap:Ee,normalMap:ge,displacementMap:Be,emissiveMap:we,normalMapObjectSpace:ge&&_.normalMapType===1,normalMapTangentSpace:ge&&_.normalMapType===0,packedNormalMap:ge&&_.normalMapType===0&&np(_.normalMap.format),metalnessMap:Ue,roughnessMap:We,anisotropy:tt,anisotropyMap:Y,clearcoat:rt,clearcoatMap:ne,clearcoatNormalMap:he,clearcoatRoughnessMap:ue,dispersion:pt,iridescence:A,iridescenceMap:X,iridescenceThicknessMap:Z,sheen:S,sheenColorMap:Te,sheenRoughnessMap:C,specularMap:ye,specularColorMap:ae,specularIntensityMap:Ie,transmission:B,transmissionMap:J,thicknessMap:Ze,gradientMap:L,opaque:_.transparent===!1&&_.blending===1&&_.alphaToCoverage===!1,alphaMap:$,alphaTest:q,alphaHash:Me,combine:_.combine,mapUv:ht&&g(_.map.channel),aoMapUv:re&&g(_.aoMap.channel),lightMapUv:ie&&g(_.lightMap.channel),bumpMapUv:Ee&&g(_.bumpMap.channel),normalMapUv:ge&&g(_.normalMap.channel),displacementMapUv:Be&&g(_.displacementMap.channel),emissiveMapUv:we&&g(_.emissiveMap.channel),metalnessMapUv:Ue&&g(_.metalnessMap.channel),roughnessMapUv:We&&g(_.roughnessMap.channel),anisotropyMapUv:Y&&g(_.anisotropyMap.channel),clearcoatMapUv:ne&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:he&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ue&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:X&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:Z&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:Te&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:C&&g(_.sheenRoughnessMap.channel),specularMapUv:ye&&g(_.specularMap.channel),specularColorMapUv:ae&&g(_.specularColorMap.channel),specularIntensityMapUv:Ie&&g(_.specularIntensityMap.channel),transmissionMapUv:J&&g(_.transmissionMap.channel),thicknessMapUv:Ze&&g(_.thicknessMap.channel),alphaMapUv:$&&g(_.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(ge||tt),vertexNormals:!!V.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!V.attributes.uv&&(ht||$),fog:!!W,useFog:_.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||V.attributes.normal===void 0&&ge===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Ne,skinning:U.isSkinnedMesh===!0,hasPositionAttribute:V.attributes.position!==void 0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:Re,morphTextureStride:Qe,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numLightProbeGrids:k.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&w.length>0,shadowMapType:i.shadowMap.type,toneMapping:ee,decodeVideoTexture:ht&&_.map.isVideoTexture===!0&&et.getTransfer(_.map.colorSpace)===lt,decodeVideoTextureEmissive:we&&_.emissiveMap.isVideoTexture===!0&&et.getTransfer(_.emissiveMap.colorSpace)===lt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===2,flipSided:_.side===1,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:be&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(be&&_.extensions.multiDraw===!0||Ge)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Ae.vertexUv1s=l.has(1),Ae.vertexUv2s=l.has(2),Ae.vertexUv3s=l.has(3),l.clear(),Ae}function m(_){const b=[];if(_.shaderID?b.push(_.shaderID):(b.push(_.customVertexShaderID),b.push(_.customFragmentShaderID)),_.defines!==void 0)for(const w in _.defines)b.push(w),b.push(_.defines[w]);return _.isRawShaderMaterial===!1&&(p(b,_),y(b,_),b.push(i.outputColorSpace)),b.push(_.customProgramCacheKey),b.join()}function p(_,b){_.push(b.precision),_.push(b.outputColorSpace),_.push(b.envMapMode),_.push(b.envMapCubeUVHeight),_.push(b.mapUv),_.push(b.alphaMapUv),_.push(b.lightMapUv),_.push(b.aoMapUv),_.push(b.bumpMapUv),_.push(b.normalMapUv),_.push(b.displacementMapUv),_.push(b.emissiveMapUv),_.push(b.metalnessMapUv),_.push(b.roughnessMapUv),_.push(b.anisotropyMapUv),_.push(b.clearcoatMapUv),_.push(b.clearcoatNormalMapUv),_.push(b.clearcoatRoughnessMapUv),_.push(b.iridescenceMapUv),_.push(b.iridescenceThicknessMapUv),_.push(b.sheenColorMapUv),_.push(b.sheenRoughnessMapUv),_.push(b.specularMapUv),_.push(b.specularColorMapUv),_.push(b.specularIntensityMapUv),_.push(b.transmissionMapUv),_.push(b.thicknessMapUv),_.push(b.combine),_.push(b.fogExp2),_.push(b.sizeAttenuation),_.push(b.morphTargetsCount),_.push(b.morphAttributeCount),_.push(b.numDirLights),_.push(b.numPointLights),_.push(b.numSpotLights),_.push(b.numSpotLightMaps),_.push(b.numHemiLights),_.push(b.numRectAreaLights),_.push(b.numDirLightShadows),_.push(b.numPointLightShadows),_.push(b.numSpotLightShadows),_.push(b.numSpotLightShadowsWithMaps),_.push(b.numLightProbes),_.push(b.shadowMapType),_.push(b.toneMapping),_.push(b.numClippingPlanes),_.push(b.numClipIntersection),_.push(b.depthPacking)}function y(_,b){a.disableAll(),b.instancing&&a.enable(0),b.instancingColor&&a.enable(1),b.instancingMorph&&a.enable(2),b.matcap&&a.enable(3),b.envMap&&a.enable(4),b.normalMapObjectSpace&&a.enable(5),b.normalMapTangentSpace&&a.enable(6),b.clearcoat&&a.enable(7),b.iridescence&&a.enable(8),b.alphaTest&&a.enable(9),b.vertexColors&&a.enable(10),b.vertexAlphas&&a.enable(11),b.vertexUv1s&&a.enable(12),b.vertexUv2s&&a.enable(13),b.vertexUv3s&&a.enable(14),b.vertexTangents&&a.enable(15),b.anisotropy&&a.enable(16),b.alphaHash&&a.enable(17),b.batching&&a.enable(18),b.dispersion&&a.enable(19),b.batchingColor&&a.enable(20),b.gradientMap&&a.enable(21),b.packedNormalMap&&a.enable(22),b.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reversedDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),b.numLightProbeGrids>0&&a.enable(22),b.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function E(_){const b=d[_.type];let w;if(b){const F=Jt[b];w=mc.clone(F.uniforms)}else w=_.uniforms;return w}function v(_,b){let w=u.get(b);return w!==void 0?++w.usedTimes:(w=new Qd(i,b,_,r),c.push(w),u.set(b,w)),w}function R(_){if(--_.usedTimes===0){const b=c.indexOf(_);c[b]=c[c.length-1],c.pop(),u.delete(_.cacheKey),_.destroy()}}function T(_){o.remove(_)}function P(){o.dispose()}return{getParameters:M,getProgramCacheKey:m,getUniforms:E,acquireProgram:v,releaseProgram:R,releaseShaderCache:T,programs:c,dispose:P}}function rp(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,l){i.get(a)[o]=l}function s(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:s}}function sp(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function ka(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Wa(){const i=[];let e=0;const t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function a(h){let d=0;return h.isInstancedMesh&&(d+=2),h.isSkinnedMesh&&(d+=1),d}function o(h,d,g,M,m,p){let y=i[e];return y===void 0?(y={id:h.id,object:h,geometry:d,material:g,materialVariant:a(h),groupOrder:M,renderOrder:h.renderOrder,z:m,group:p},i[e]=y):(y.id=h.id,y.object=h,y.geometry=d,y.material=g,y.materialVariant=a(h),y.groupOrder=M,y.renderOrder=h.renderOrder,y.z=m,y.group=p),e++,y}function l(h,d,g,M,m,p){const y=o(h,d,g,M,m,p);g.transmission>0?n.push(y):g.transparent===!0?r.push(y):t.push(y)}function c(h,d,g,M,m,p){const y=o(h,d,g,M,m,p);g.transmission>0?n.unshift(y):g.transparent===!0?r.unshift(y):t.unshift(y)}function u(h,d,g){t.length>1&&t.sort(h||sp),n.length>1&&n.sort(d||ka),r.length>1&&r.sort(d||ka),g&&(t.reverse(),n.reverse(),r.reverse())}function f(){for(let h=e,d=i.length;h<d;h++){const g=i[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:l,unshift:c,finish:f,sort:u}}function ap(){let i=new WeakMap;function e(n,r){const s=i.get(n);let a;return s===void 0?(a=new Wa,i.set(n,[a])):r>=s.length?(a=new Wa,s.push(a)):a=s[r],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function op(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new Ye};break;case"SpotLight":t={position:new D,direction:new D,color:new Ye,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new Ye,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new Ye,groundColor:new Ye};break;case"RectAreaLight":t={color:new Ye,position:new D,halfWidth:new D,halfHeight:new D};break}return i[e.id]=t,t}}}function lp(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let cp=0;function hp(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function up(i){const e=new op,t=lp(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new D);const r=new D,s=new ot,a=new ot;function o(c){let u=0,f=0,h=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let d=0,g=0,M=0,m=0,p=0,y=0,E=0,v=0,R=0,T=0,P=0;c.sort(hp);for(let b=0,w=c.length;b<w;b++){const F=c[b],U=F.color,k=F.intensity,W=F.distance;let V=null;if(F.shadow&&F.shadow.map&&(F.shadow.map.texture.format===1030?V=F.shadow.map.texture:V=F.shadow.map.depthTexture||F.shadow.map.texture),F.isAmbientLight)u+=U.r*k,f+=U.g*k,h+=U.b*k;else if(F.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(F.sh.coefficients[H],k);P++}else if(F.isDirectionalLight){const H=e.get(F);if(H.color.copy(F.color).multiplyScalar(F.intensity),F.castShadow){const z=F.shadow,Q=t.get(F);Q.shadowIntensity=z.intensity,Q.shadowBias=z.bias,Q.shadowNormalBias=z.normalBias,Q.shadowRadius=z.radius,Q.shadowMapSize=z.mapSize,n.directionalShadow[d]=Q,n.directionalShadowMap[d]=V,n.directionalShadowMatrix[d]=F.shadow.matrix,y++}n.directional[d]=H,d++}else if(F.isSpotLight){const H=e.get(F);H.position.setFromMatrixPosition(F.matrixWorld),H.color.copy(U).multiplyScalar(k),H.distance=W,H.coneCos=Math.cos(F.angle),H.penumbraCos=Math.cos(F.angle*(1-F.penumbra)),H.decay=F.decay,n.spot[M]=H;const z=F.shadow;if(F.map&&(n.spotLightMap[R]=F.map,R++,z.updateMatrices(F),F.castShadow&&T++),n.spotLightMatrix[M]=z.matrix,F.castShadow){const Q=t.get(F);Q.shadowIntensity=z.intensity,Q.shadowBias=z.bias,Q.shadowNormalBias=z.normalBias,Q.shadowRadius=z.radius,Q.shadowMapSize=z.mapSize,n.spotShadow[M]=Q,n.spotShadowMap[M]=V,v++}M++}else if(F.isRectAreaLight){const H=e.get(F);H.color.copy(U).multiplyScalar(k),H.halfWidth.set(F.width*.5,0,0),H.halfHeight.set(0,F.height*.5,0),n.rectArea[m]=H,m++}else if(F.isPointLight){const H=e.get(F);if(H.color.copy(F.color).multiplyScalar(F.intensity),H.distance=F.distance,H.decay=F.decay,F.castShadow){const z=F.shadow,Q=t.get(F);Q.shadowIntensity=z.intensity,Q.shadowBias=z.bias,Q.shadowNormalBias=z.normalBias,Q.shadowRadius=z.radius,Q.shadowMapSize=z.mapSize,Q.shadowCameraNear=z.camera.near,Q.shadowCameraFar=z.camera.far,n.pointShadow[g]=Q,n.pointShadowMap[g]=V,n.pointShadowMatrix[g]=F.shadow.matrix,E++}n.point[g]=H,g++}else if(F.isHemisphereLight){const H=e.get(F);H.skyColor.copy(F.color).multiplyScalar(k),H.groundColor.copy(F.groundColor).multiplyScalar(k),n.hemi[p]=H,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Se.LTC_FLOAT_1,n.rectAreaLTC2=Se.LTC_FLOAT_2):(n.rectAreaLTC1=Se.LTC_HALF_1,n.rectAreaLTC2=Se.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=f,n.ambient[2]=h;const _=n.hash;(_.directionalLength!==d||_.pointLength!==g||_.spotLength!==M||_.rectAreaLength!==m||_.hemiLength!==p||_.numDirectionalShadows!==y||_.numPointShadows!==E||_.numSpotShadows!==v||_.numSpotMaps!==R||_.numLightProbes!==P)&&(n.directional.length=d,n.spot.length=M,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=v+R-T,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=P,_.directionalLength=d,_.pointLength=g,_.spotLength=M,_.rectAreaLength=m,_.hemiLength=p,_.numDirectionalShadows=y,_.numPointShadows=E,_.numSpotShadows=v,_.numSpotMaps=R,_.numLightProbes=P,n.version=cp++)}function l(c,u){let f=0,h=0,d=0,g=0,M=0;const m=u.matrixWorldInverse;for(let p=0,y=c.length;p<y;p++){const E=c[p];if(E.isDirectionalLight){const v=n.directional[f];v.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),v.direction.sub(r),v.direction.transformDirection(m),f++}else if(E.isSpotLight){const v=n.spot[d];v.position.setFromMatrixPosition(E.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),v.direction.sub(r),v.direction.transformDirection(m),d++}else if(E.isRectAreaLight){const v=n.rectArea[g];v.position.setFromMatrixPosition(E.matrixWorld),v.position.applyMatrix4(m),a.identity(),s.copy(E.matrixWorld),s.premultiply(m),a.extractRotation(s),v.halfWidth.set(E.width*.5,0,0),v.halfHeight.set(0,E.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),g++}else if(E.isPointLight){const v=n.point[h];v.position.setFromMatrixPosition(E.matrixWorld),v.position.applyMatrix4(m),h++}else if(E.isHemisphereLight){const v=n.hemi[M];v.direction.setFromMatrixPosition(E.matrixWorld),v.direction.transformDirection(m),M++}}}return{setup:o,setupView:l,state:n}}function Xa(i){const e=new up(i),t=[],n=[],r=[];function s(h){f.camera=h,t.length=0,n.length=0,r.length=0}function a(h){t.push(h)}function o(h){n.push(h)}function l(h){r.push(h)}function c(){e.setup(t)}function u(h){e.setupView(t,h)}const f={lightsArray:t,shadowsArray:n,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:f,setupLights:c,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function fp(i){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new Xa(i),e.set(r,[o])):s>=a.length?(o=new Xa(i),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const dp=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,pp=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,mp=[new D(1,0,0),new D(-1,0,0),new D(0,1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1)],gp=[new D(0,-1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1),new D(0,-1,0),new D(0,-1,0)],qa=new ot,Mi=new D,rs=new D;function _p(i,e,t){let n=new ds;const r=new le,s=new le,a=new dt,o=new Sc,l=new Mc,c={},u=t.maxTextureSize,f={0:1,1:0,2:2},h=new $t({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new le},radius:{value:4}},vertexShader:dp,fragmentShader:pp}),d=h.clone();d.defines.HORIZONTAL_PASS=1;const g=new Mt;g.setAttribute("position",new Xt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new Dt(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let p=this.type;this.render=function(T,P,_){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===2&&(Oe("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=1);const b=i.getRenderTarget(),w=i.getActiveCubeFace(),F=i.getActiveMipmapLevel(),U=i.state;U.setBlending(0),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const k=p!==this.type;k&&P.traverse(function(W){W.material&&(Array.isArray(W.material)?W.material.forEach(V=>V.needsUpdate=!0):W.material.needsUpdate=!0)});for(let W=0,V=T.length;W<V;W++){const H=T[W],z=H.shadow;if(z===void 0){Oe("WebGLShadowMap:",H,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;r.copy(z.mapSize);const Q=z.getFrameExtents();r.multiply(Q),s.copy(z.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/Q.x),r.x=s.x*Q.x,z.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/Q.y),r.y=s.y*Q.y,z.mapSize.y=s.y));const se=i.state.buffers.depth.getReversed();if(z.camera._reversedDepth=se,z.map===null||k===!0){if(z.map!==null&&(z.map.depthTexture!==null&&(z.map.depthTexture.dispose(),z.map.depthTexture=null),z.map.dispose()),this.type===3){if(H.isPointLight){Oe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}z.map=new Kt(r.x,r.y,{format:1030,type:1016,minFilter:1006,magFilter:1006,generateMipmaps:!1}),z.map.texture.name=H.name+".shadowMap",z.map.depthTexture=new ai(r.x,r.y,1015),z.map.depthTexture.name=H.name+".shadowMapDepth",z.map.depthTexture.format=1026,z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=1003,z.map.depthTexture.magFilter=1003}else H.isPointLight?(z.map=new Ro(r.x),z.map.depthTexture=new Fl(r.x,1014)):(z.map=new Kt(r.x,r.y),z.map.depthTexture=new ai(r.x,r.y,1014)),z.map.depthTexture.name=H.name+".shadowMap",z.map.depthTexture.format=1026,this.type===1?(z.map.depthTexture.compareFunction=se?518:515,z.map.depthTexture.minFilter=1006,z.map.depthTexture.magFilter=1006):(z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=1003,z.map.depthTexture.magFilter=1003);z.camera.updateProjectionMatrix()}const ce=z.map.isWebGLCubeRenderTarget?6:1;for(let me=0;me<ce;me++){if(z.map.isWebGLCubeRenderTarget)i.setRenderTarget(z.map,me),i.clear();else{me===0&&(i.setRenderTarget(z.map),i.clear());const Re=z.getViewport(me);a.set(s.x*Re.x,s.y*Re.y,s.x*Re.z,s.y*Re.w),U.viewport(a)}if(H.isPointLight){const Re=z.camera,Qe=z.matrix,st=H.distance||Re.far;st!==Re.far&&(Re.far=st,Re.updateProjectionMatrix()),Mi.setFromMatrixPosition(H.matrixWorld),Re.position.copy(Mi),rs.copy(Re.position),rs.add(mp[me]),Re.up.copy(gp[me]),Re.lookAt(rs),Re.updateMatrixWorld(),Qe.makeTranslation(-Mi.x,-Mi.y,-Mi.z),qa.multiplyMatrices(Re.projectionMatrix,Re.matrixWorldInverse),z._frustum.setFromProjectionMatrix(qa,Re.coordinateSystem,Re.reversedDepth)}else z.updateMatrices(H);n=z.getFrustum(),v(P,_,z.camera,H,this.type)}z.isPointLightShadow!==!0&&this.type===3&&y(z,_),z.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(b,w,F)};function y(T,P){const _=e.update(M);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,d.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Kt(r.x,r.y,{format:1030,type:1016})),h.uniforms.shadow_pass.value=T.map.depthTexture,h.uniforms.resolution.value=T.mapSize,h.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(P,null,_,h,M,null),d.uniforms.shadow_pass.value=T.mapPass.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(P,null,_,d,M,null)}function E(T,P,_,b){let w=null;const F=_.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(F!==void 0)w=F;else if(w=_.isPointLight===!0?l:o,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const U=w.uuid,k=P.uuid;let W=c[U];W===void 0&&(W={},c[U]=W);let V=W[k];V===void 0&&(V=w.clone(),W[k]=V,P.addEventListener("dispose",R)),w=V}if(w.visible=P.visible,w.wireframe=P.wireframe,b===3?w.side=P.shadowSide!==null?P.shadowSide:P.side:w.side=P.shadowSide!==null?P.shadowSide:f[P.side],w.alphaMap=P.alphaMap,w.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,w.map=P.map,w.clipShadows=P.clipShadows,w.clippingPlanes=P.clippingPlanes,w.clipIntersection=P.clipIntersection,w.displacementMap=P.displacementMap,w.displacementScale=P.displacementScale,w.displacementBias=P.displacementBias,w.wireframeLinewidth=P.wireframeLinewidth,w.linewidth=P.linewidth,_.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const U=i.properties.get(w);U.light=_}return w}function v(T,P,_,b,w){if(T.visible===!1)return;if(T.layers.test(P.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&w===3)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,T.matrixWorld);const k=e.update(T),W=T.material;if(Array.isArray(W)){const V=k.groups;for(let H=0,z=V.length;H<z;H++){const Q=V[H],se=W[Q.materialIndex];if(se&&se.visible){const ce=E(T,se,b,w);T.onBeforeShadow(i,T,P,_,k,ce,Q),i.renderBufferDirect(_,null,k,ce,T,Q),T.onAfterShadow(i,T,P,_,k,ce,Q)}}}else if(W.visible){const V=E(T,W,b,w);T.onBeforeShadow(i,T,P,_,k,V,null),i.renderBufferDirect(_,null,k,V,T,null),T.onAfterShadow(i,T,P,_,k,V,null)}}const U=T.children;for(let k=0,W=U.length;k<W;k++)v(U[k],P,_,b,w)}function R(T){T.target.removeEventListener("dispose",R);for(const _ in c){const b=c[_],w=T.target.uuid;w in b&&(b[w].dispose(),delete b[w])}}}function vp(i,e){function t(){let L=!1;const $=new dt;let q=null;const Me=new dt(0,0,0,0);return{setMask:function(be){q!==be&&!L&&(i.colorMask(be,be,be,be),q=be)},setLocked:function(be){L=be},setClear:function(be,ee,Ae,Xe,mt){mt===!0&&(be*=Xe,ee*=Xe,Ae*=Xe),$.set(be,ee,Ae,Xe),Me.equals($)===!1&&(i.clearColor(be,ee,Ae,Xe),Me.copy($))},reset:function(){L=!1,q=null,Me.set(-1,0,0,0)}}}function n(){let L=!1,$=!1,q=null,Me=null,be=null;return{setReversed:function(ee){if($!==ee){const Ae=e.get("EXT_clip_control");ee?Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.ZERO_TO_ONE_EXT):Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.NEGATIVE_ONE_TO_ONE_EXT),$=ee;const Xe=be;be=null,this.setClear(Xe)}},getReversed:function(){return $},setTest:function(ee){ee?fe(i.DEPTH_TEST):Ne(i.DEPTH_TEST)},setMask:function(ee){q!==ee&&!L&&(i.depthMask(ee),q=ee)},setFunc:function(ee){if($&&(ee=ko[ee]),Me!==ee){switch(ee){case 0:i.depthFunc(i.NEVER);break;case 1:i.depthFunc(i.ALWAYS);break;case 2:i.depthFunc(i.LESS);break;case 3:i.depthFunc(i.LEQUAL);break;case 4:i.depthFunc(i.EQUAL);break;case 5:i.depthFunc(i.GEQUAL);break;case 6:i.depthFunc(i.GREATER);break;case 7:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Me=ee}},setLocked:function(ee){L=ee},setClear:function(ee){be!==ee&&(be=ee,$&&(ee=1-ee),i.clearDepth(ee))},reset:function(){L=!1,q=null,Me=null,be=null,$=!1}}}function r(){let L=!1,$=null,q=null,Me=null,be=null,ee=null,Ae=null,Xe=null,mt=null;return{setTest:function(ct){L||(ct?fe(i.STENCIL_TEST):Ne(i.STENCIL_TEST))},setMask:function(ct){$!==ct&&!L&&(i.stencilMask(ct),$=ct)},setFunc:function(ct,_t,yt){(q!==ct||Me!==_t||be!==yt)&&(i.stencilFunc(ct,_t,yt),q=ct,Me=_t,be=yt)},setOp:function(ct,_t,yt){(ee!==ct||Ae!==_t||Xe!==yt)&&(i.stencilOp(ct,_t,yt),ee=ct,Ae=_t,Xe=yt)},setLocked:function(ct){L=ct},setClear:function(ct){mt!==ct&&(i.clearStencil(ct),mt=ct)},reset:function(){L=!1,$=null,q=null,Me=null,be=null,ee=null,Ae=null,Xe=null,mt=null}}}const s=new t,a=new n,o=new r,l=new WeakMap,c=new WeakMap;let u={},f={},h={},d=new WeakMap,g=[],M=null,m=!1,p=null,y=null,E=null,v=null,R=null,T=null,P=null,_=new Ye(0,0,0),b=0,w=!1,F=null,U=null,k=null,W=null,V=null;const H=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,Q=0;const se=i.getParameter(i.VERSION);se.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(se)[1]),z=Q>=1):se.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(se)[1]),z=Q>=2);let ce=null,me={};const Re=i.getParameter(i.SCISSOR_BOX),Qe=i.getParameter(i.VIEWPORT),st=new dt().fromArray(Re),it=new dt().fromArray(Qe);function K(L,$,q,Me){const be=new Uint8Array(4),ee=i.createTexture();i.bindTexture(L,ee),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ae=0;Ae<q;Ae++)L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY?i.texImage3D($,0,i.RGBA,1,1,Me,0,i.RGBA,i.UNSIGNED_BYTE,be):i.texImage2D($+Ae,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,be);return ee}const _e={};_e[i.TEXTURE_2D]=K(i.TEXTURE_2D,i.TEXTURE_2D,1),_e[i.TEXTURE_CUBE_MAP]=K(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),_e[i.TEXTURE_2D_ARRAY]=K(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),_e[i.TEXTURE_3D]=K(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),fe(i.DEPTH_TEST),a.setFunc(3),Ee(!1),ge(1),fe(i.CULL_FACE),re(0);function fe(L){u[L]!==!0&&(i.enable(L),u[L]=!0)}function Ne(L){u[L]!==!1&&(i.disable(L),u[L]=!1)}function He(L,$){return h[L]!==$?(i.bindFramebuffer(L,$),h[L]=$,L===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=$),L===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=$),!0):!1}function Ge(L,$){let q=g,Me=!1;if(L){q=d.get($),q===void 0&&(q=[],d.set($,q));const be=L.textures;if(q.length!==be.length||q[0]!==i.COLOR_ATTACHMENT0){for(let ee=0,Ae=be.length;ee<Ae;ee++)q[ee]=i.COLOR_ATTACHMENT0+ee;q.length=be.length,Me=!0}}else q[0]!==i.BACK&&(q[0]=i.BACK,Me=!0);Me&&i.drawBuffers(q)}function ht(L){return M!==L?(i.useProgram(L),M=L,!0):!1}const Ve={100:i.FUNC_ADD,101:i.FUNC_SUBTRACT,102:i.FUNC_REVERSE_SUBTRACT};Ve[103]=i.MIN,Ve[104]=i.MAX;const j={200:i.ZERO,201:i.ONE,202:i.SRC_COLOR,204:i.SRC_ALPHA,210:i.SRC_ALPHA_SATURATE,208:i.DST_COLOR,206:i.DST_ALPHA,203:i.ONE_MINUS_SRC_COLOR,205:i.ONE_MINUS_SRC_ALPHA,209:i.ONE_MINUS_DST_COLOR,207:i.ONE_MINUS_DST_ALPHA,211:i.CONSTANT_COLOR,212:i.ONE_MINUS_CONSTANT_COLOR,213:i.CONSTANT_ALPHA,214:i.ONE_MINUS_CONSTANT_ALPHA};function re(L,$,q,Me,be,ee,Ae,Xe,mt,ct){if(L===0){m===!0&&(Ne(i.BLEND),m=!1);return}if(m===!1&&(fe(i.BLEND),m=!0),L!==5){if(L!==p||ct!==w){if((y!==100||R!==100)&&(i.blendEquation(i.FUNC_ADD),y=100,R=100),ct)switch(L){case 1:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFunc(i.ONE,i.ONE);break;case 3:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case 4:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:je("WebGLState: Invalid blending: ",L);break}else switch(L){case 1:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case 3:je("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case 4:je("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:je("WebGLState: Invalid blending: ",L);break}E=null,v=null,T=null,P=null,_.set(0,0,0),b=0,p=L,w=ct}return}be=be||$,ee=ee||q,Ae=Ae||Me,($!==y||be!==R)&&(i.blendEquationSeparate(Ve[$],Ve[be]),y=$,R=be),(q!==E||Me!==v||ee!==T||Ae!==P)&&(i.blendFuncSeparate(j[q],j[Me],j[ee],j[Ae]),E=q,v=Me,T=ee,P=Ae),(Xe.equals(_)===!1||mt!==b)&&(i.blendColor(Xe.r,Xe.g,Xe.b,mt),_.copy(Xe),b=mt),p=L,w=!1}function ie(L,$){L.side===2?Ne(i.CULL_FACE):fe(i.CULL_FACE);let q=L.side===1;$&&(q=!q),Ee(q),L.blending===1&&L.transparent===!1?re(0):re(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),s.setMask(L.colorWrite);const Me=L.stencilWrite;o.setTest(Me),Me&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),we(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?fe(i.SAMPLE_ALPHA_TO_COVERAGE):Ne(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ee(L){F!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),F=L)}function ge(L){L!==0?(fe(i.CULL_FACE),L!==U&&(L===1?i.cullFace(i.BACK):L===2?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ne(i.CULL_FACE),U=L}function Be(L){L!==k&&(z&&i.lineWidth(L),k=L)}function we(L,$,q){L?(fe(i.POLYGON_OFFSET_FILL),(W!==$||V!==q)&&(W=$,V=q,a.getReversed()&&($=-$),i.polygonOffset($,q))):Ne(i.POLYGON_OFFSET_FILL)}function Ue(L){L?fe(i.SCISSOR_TEST):Ne(i.SCISSOR_TEST)}function We(L){L===void 0&&(L=i.TEXTURE0+H-1),ce!==L&&(i.activeTexture(L),ce=L)}function tt(L,$,q){q===void 0&&(ce===null?q=i.TEXTURE0+H-1:q=ce);let Me=me[q];Me===void 0&&(Me={type:void 0,texture:void 0},me[q]=Me),(Me.type!==L||Me.texture!==$)&&(ce!==q&&(i.activeTexture(q),ce=q),i.bindTexture(L,$||_e[L]),Me.type=L,Me.texture=$)}function rt(){const L=me[ce];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function pt(){try{i.compressedTexImage2D(...arguments)}catch(L){je("WebGLState:",L)}}function A(){try{i.compressedTexImage3D(...arguments)}catch(L){je("WebGLState:",L)}}function S(){try{i.texSubImage2D(...arguments)}catch(L){je("WebGLState:",L)}}function B(){try{i.texSubImage3D(...arguments)}catch(L){je("WebGLState:",L)}}function Y(){try{i.compressedTexSubImage2D(...arguments)}catch(L){je("WebGLState:",L)}}function ne(){try{i.compressedTexSubImage3D(...arguments)}catch(L){je("WebGLState:",L)}}function he(){try{i.texStorage2D(...arguments)}catch(L){je("WebGLState:",L)}}function ue(){try{i.texStorage3D(...arguments)}catch(L){je("WebGLState:",L)}}function X(){try{i.texImage2D(...arguments)}catch(L){je("WebGLState:",L)}}function Z(){try{i.texImage3D(...arguments)}catch(L){je("WebGLState:",L)}}function Te(L){return f[L]!==void 0?f[L]:i.getParameter(L)}function C(L,$){f[L]!==$&&(i.pixelStorei(L,$),f[L]=$)}function ye(L){st.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),st.copy(L))}function ae(L){it.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),it.copy(L))}function Ie(L,$){let q=c.get($);q===void 0&&(q=new WeakMap,c.set($,q));let Me=q.get(L);Me===void 0&&(Me=i.getUniformBlockIndex($,L.name),q.set(L,Me))}function J(L,$){const Me=c.get($).get(L);l.get($)!==Me&&(i.uniformBlockBinding($,Me,L.__bindingPointIndex),l.set($,Me))}function Ze(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},f={},ce=null,me={},h={},d=new WeakMap,g=[],M=null,m=!1,p=null,y=null,E=null,v=null,R=null,T=null,P=null,_=new Ye(0,0,0),b=0,w=!1,F=null,U=null,k=null,W=null,V=null,st.set(0,0,i.canvas.width,i.canvas.height),it.set(0,0,i.canvas.width,i.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:fe,disable:Ne,bindFramebuffer:He,drawBuffers:Ge,useProgram:ht,setBlending:re,setMaterial:ie,setFlipSided:Ee,setCullFace:ge,setLineWidth:Be,setPolygonOffset:we,setScissorTest:Ue,activeTexture:We,bindTexture:tt,unbindTexture:rt,compressedTexImage2D:pt,compressedTexImage3D:A,texImage2D:X,texImage3D:Z,pixelStorei:C,getParameter:Te,updateUBOMapping:Ie,uniformBlockBinding:J,texStorage2D:he,texStorage3D:ue,texSubImage2D:S,texSubImage3D:B,compressedTexSubImage2D:Y,compressedTexSubImage3D:ne,scissor:ye,viewport:ae,reset:Ze}}function xp(i,e,t,n,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new le,u=new WeakMap,f=new Set;let h;const d=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function M(A,S){return g?new OffscreenCanvas(A,S):Ci("canvas")}function m(A,S,B){let Y=1;const ne=pt(A);if((ne.width>B||ne.height>B)&&(Y=B/Math.max(ne.width,ne.height)),Y<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const he=Math.floor(Y*ne.width),ue=Math.floor(Y*ne.height);h===void 0&&(h=M(he,ue));const X=S?M(he,ue):h;return X.width=he,X.height=ue,X.getContext("2d").drawImage(A,0,0,he,ue),Oe("WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+he+"x"+ue+")."),X}else return"data"in A&&Oe("WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),A;return A}function p(A){return A.generateMipmaps}function y(A){i.generateMipmap(A)}function E(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(A,S,B,Y,ne,he=!1){if(A!==null){if(i[A]!==void 0)return i[A];Oe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let ue;Y&&(ue=e.get("EXT_texture_norm16"),ue||Oe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let X=S;if(S===i.RED&&(B===i.FLOAT&&(X=i.R32F),B===i.HALF_FLOAT&&(X=i.R16F),B===i.UNSIGNED_BYTE&&(X=i.R8),B===i.UNSIGNED_SHORT&&ue&&(X=ue.R16_EXT),B===i.SHORT&&ue&&(X=ue.R16_SNORM_EXT)),S===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(X=i.R8UI),B===i.UNSIGNED_SHORT&&(X=i.R16UI),B===i.UNSIGNED_INT&&(X=i.R32UI),B===i.BYTE&&(X=i.R8I),B===i.SHORT&&(X=i.R16I),B===i.INT&&(X=i.R32I)),S===i.RG&&(B===i.FLOAT&&(X=i.RG32F),B===i.HALF_FLOAT&&(X=i.RG16F),B===i.UNSIGNED_BYTE&&(X=i.RG8),B===i.UNSIGNED_SHORT&&ue&&(X=ue.RG16_EXT),B===i.SHORT&&ue&&(X=ue.RG16_SNORM_EXT)),S===i.RG_INTEGER&&(B===i.UNSIGNED_BYTE&&(X=i.RG8UI),B===i.UNSIGNED_SHORT&&(X=i.RG16UI),B===i.UNSIGNED_INT&&(X=i.RG32UI),B===i.BYTE&&(X=i.RG8I),B===i.SHORT&&(X=i.RG16I),B===i.INT&&(X=i.RG32I)),S===i.RGB_INTEGER&&(B===i.UNSIGNED_BYTE&&(X=i.RGB8UI),B===i.UNSIGNED_SHORT&&(X=i.RGB16UI),B===i.UNSIGNED_INT&&(X=i.RGB32UI),B===i.BYTE&&(X=i.RGB8I),B===i.SHORT&&(X=i.RGB16I),B===i.INT&&(X=i.RGB32I)),S===i.RGBA_INTEGER&&(B===i.UNSIGNED_BYTE&&(X=i.RGBA8UI),B===i.UNSIGNED_SHORT&&(X=i.RGBA16UI),B===i.UNSIGNED_INT&&(X=i.RGBA32UI),B===i.BYTE&&(X=i.RGBA8I),B===i.SHORT&&(X=i.RGBA16I),B===i.INT&&(X=i.RGBA32I)),S===i.RGB&&(B===i.UNSIGNED_SHORT&&ue&&(X=ue.RGB16_EXT),B===i.SHORT&&ue&&(X=ue.RGB16_SNORM_EXT),B===i.UNSIGNED_INT_5_9_9_9_REV&&(X=i.RGB9_E5),B===i.UNSIGNED_INT_10F_11F_11F_REV&&(X=i.R11F_G11F_B10F)),S===i.RGBA){const Z=he?dr:et.getTransfer(ne);B===i.FLOAT&&(X=i.RGBA32F),B===i.HALF_FLOAT&&(X=i.RGBA16F),B===i.UNSIGNED_BYTE&&(X=Z===lt?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT&&ue&&(X=ue.RGBA16_EXT),B===i.SHORT&&ue&&(X=ue.RGBA16_SNORM_EXT),B===i.UNSIGNED_SHORT_4_4_4_4&&(X=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(X=i.RGB5_A1)}return(X===i.R16F||X===i.R32F||X===i.RG16F||X===i.RG32F||X===i.RGBA16F||X===i.RGBA32F)&&e.get("EXT_color_buffer_float"),X}function R(A,S){let B;return A?S===null||S===1014||S===1020?B=i.DEPTH24_STENCIL8:S===1015?B=i.DEPTH32F_STENCIL8:S===1012&&(B=i.DEPTH24_STENCIL8,Oe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===1014||S===1020?B=i.DEPTH_COMPONENT24:S===1015?B=i.DEPTH_COMPONENT32F:S===1012&&(B=i.DEPTH_COMPONENT16),B}function T(A,S){return p(A)===!0||A.isFramebufferTexture&&A.minFilter!==1003&&A.minFilter!==1006?Math.log2(Math.max(S.width,S.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?S.mipmaps.length:1}function P(A){const S=A.target;S.removeEventListener("dispose",P),b(S),S.isVideoTexture&&u.delete(S),S.isHTMLTexture&&f.delete(S)}function _(A){const S=A.target;S.removeEventListener("dispose",_),F(S)}function b(A){const S=n.get(A);if(S.__webglInit===void 0)return;const B=A.source,Y=d.get(B);if(Y){const ne=Y[S.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&w(A),Object.keys(Y).length===0&&d.delete(B)}n.remove(A)}function w(A){const S=n.get(A);i.deleteTexture(S.__webglTexture);const B=A.source,Y=d.get(B);delete Y[S.__cacheKey],a.memory.textures--}function F(A){const S=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(S.__webglFramebuffer[Y]))for(let ne=0;ne<S.__webglFramebuffer[Y].length;ne++)i.deleteFramebuffer(S.__webglFramebuffer[Y][ne]);else i.deleteFramebuffer(S.__webglFramebuffer[Y]);S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer[Y])}else{if(Array.isArray(S.__webglFramebuffer))for(let Y=0;Y<S.__webglFramebuffer.length;Y++)i.deleteFramebuffer(S.__webglFramebuffer[Y]);else i.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&i.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let Y=0;Y<S.__webglColorRenderbuffer.length;Y++)S.__webglColorRenderbuffer[Y]&&i.deleteRenderbuffer(S.__webglColorRenderbuffer[Y]);S.__webglDepthRenderbuffer&&i.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const B=A.textures;for(let Y=0,ne=B.length;Y<ne;Y++){const he=n.get(B[Y]);he.__webglTexture&&(i.deleteTexture(he.__webglTexture),a.memory.textures--),n.remove(B[Y])}n.remove(A)}let U=0;function k(){U=0}function W(){return U}function V(A){U=A}function H(){const A=U;return A>=r.maxTextures&&Oe("WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+r.maxTextures),U+=1,A}function z(A){const S=[];return S.push(A.wrapS),S.push(A.wrapT),S.push(A.wrapR||0),S.push(A.magFilter),S.push(A.minFilter),S.push(A.anisotropy),S.push(A.internalFormat),S.push(A.format),S.push(A.type),S.push(A.generateMipmaps),S.push(A.premultiplyAlpha),S.push(A.flipY),S.push(A.unpackAlignment),S.push(A.colorSpace),S.join()}function Q(A,S){const B=n.get(A);if(A.isVideoTexture&&tt(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&B.__version!==A.version){const Y=A.image;if(Y===null)Oe("WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)Oe("WebGLRenderer: Texture marked for update but image is incomplete");else{Ne(B,A,S);return}}else A.isExternalTexture&&(B.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+S)}function se(A,S){const B=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&B.__version!==A.version){Ne(B,A,S);return}else A.isExternalTexture&&(B.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+S)}function ce(A,S){const B=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&B.__version!==A.version){Ne(B,A,S);return}t.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+S)}function me(A,S){const B=n.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&B.__version!==A.version){He(B,A,S);return}t.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+S)}const Re={1e3:i.REPEAT,1001:i.CLAMP_TO_EDGE,1002:i.MIRRORED_REPEAT},Qe={1003:i.NEAREST,1004:i.NEAREST_MIPMAP_NEAREST,1005:i.NEAREST_MIPMAP_LINEAR,1006:i.LINEAR,1007:i.LINEAR_MIPMAP_NEAREST,1008:i.LINEAR_MIPMAP_LINEAR},st={512:i.NEVER,519:i.ALWAYS,513:i.LESS,515:i.LEQUAL,514:i.EQUAL,518:i.GEQUAL,516:i.GREATER,517:i.NOTEQUAL};function it(A,S){if(S.type===1015&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===1006||S.magFilter===1007||S.magFilter===1005||S.magFilter===1008||S.minFilter===1006||S.minFilter===1007||S.minFilter===1005||S.minFilter===1008)&&Oe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,Re[S.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,Re[S.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,Re[S.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,Qe[S.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,Qe[S.minFilter]),S.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,st[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===1003||S.minFilter!==1005&&S.minFilter!==1008||S.type===1015&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){const B=e.get("EXT_texture_filter_anisotropic");i.texParameterf(A,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,r.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function K(A,S){let B=!1;A.__webglInit===void 0&&(A.__webglInit=!0,S.addEventListener("dispose",P));const Y=S.source;let ne=d.get(Y);ne===void 0&&(ne={},d.set(Y,ne));const he=z(S);if(he!==A.__cacheKey){ne[he]===void 0&&(ne[he]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,B=!0),ne[he].usedTimes++;const ue=ne[A.__cacheKey];ue!==void 0&&(ne[A.__cacheKey].usedTimes--,ue.usedTimes===0&&w(S)),A.__cacheKey=he,A.__webglTexture=ne[he].texture}return B}function _e(A,S,B){return Math.floor(Math.floor(A/B)/S)}function fe(A,S,B,Y){const he=A.updateRanges;if(he.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,S.width,S.height,B,Y,S.data);else{he.sort((C,ye)=>C.start-ye.start);let ue=0;for(let C=1;C<he.length;C++){const ye=he[ue],ae=he[C],Ie=ye.start+ye.count,J=_e(ae.start,S.width,4),Ze=_e(ye.start,S.width,4);ae.start<=Ie+1&&J===Ze&&_e(ae.start+ae.count-1,S.width,4)===J?ye.count=Math.max(ye.count,ae.start+ae.count-ye.start):(++ue,he[ue]=ae)}he.length=ue+1;const X=t.getParameter(i.UNPACK_ROW_LENGTH),Z=t.getParameter(i.UNPACK_SKIP_PIXELS),Te=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,S.width);for(let C=0,ye=he.length;C<ye;C++){const ae=he[C],Ie=Math.floor(ae.start/4),J=Math.ceil(ae.count/4),Ze=Ie%S.width,L=Math.floor(Ie/S.width),$=J,q=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Ze),t.pixelStorei(i.UNPACK_SKIP_ROWS,L),t.texSubImage2D(i.TEXTURE_2D,0,Ze,L,$,q,B,Y,S.data)}A.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,X),t.pixelStorei(i.UNPACK_SKIP_PIXELS,Z),t.pixelStorei(i.UNPACK_SKIP_ROWS,Te)}}function Ne(A,S,B){let Y=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(Y=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(Y=i.TEXTURE_3D);const ne=K(A,S),he=S.source;t.bindTexture(Y,A.__webglTexture,i.TEXTURE0+B);const ue=n.get(he);if(he.version!==ue.__version||ne===!0){if(t.activeTexture(i.TEXTURE0+B),(typeof ImageBitmap<"u"&&S.image instanceof ImageBitmap)===!1){const q=et.getPrimaries(et.workingColorSpace),Me=S.colorSpace===""?null:et.getPrimaries(S.colorSpace),be=S.colorSpace===""||q===Me?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,be)}t.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment);let Z=m(S.image,!1,r.maxTextureSize);Z=rt(S,Z);const Te=s.convert(S.format,S.colorSpace),C=s.convert(S.type);let ye=v(S.internalFormat,Te,C,S.normalized,S.colorSpace,S.isVideoTexture);it(Y,S);let ae;const Ie=S.mipmaps,J=S.isVideoTexture!==!0,Ze=ue.__version===void 0||ne===!0,L=he.dataReady,$=T(S,Z);if(S.isDepthTexture)ye=R(S.format===1027,S.type),Ze&&(J?t.texStorage2D(i.TEXTURE_2D,1,ye,Z.width,Z.height):t.texImage2D(i.TEXTURE_2D,0,ye,Z.width,Z.height,0,Te,C,null));else if(S.isDataTexture)if(Ie.length>0){J&&Ze&&t.texStorage2D(i.TEXTURE_2D,$,ye,Ie[0].width,Ie[0].height);for(let q=0,Me=Ie.length;q<Me;q++)ae=Ie[q],J?L&&t.texSubImage2D(i.TEXTURE_2D,q,0,0,ae.width,ae.height,Te,C,ae.data):t.texImage2D(i.TEXTURE_2D,q,ye,ae.width,ae.height,0,Te,C,ae.data);S.generateMipmaps=!1}else J?(Ze&&t.texStorage2D(i.TEXTURE_2D,$,ye,Z.width,Z.height),L&&fe(S,Z,Te,C)):t.texImage2D(i.TEXTURE_2D,0,ye,Z.width,Z.height,0,Te,C,Z.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){J&&Ze&&t.texStorage3D(i.TEXTURE_2D_ARRAY,$,ye,Ie[0].width,Ie[0].height,Z.depth);for(let q=0,Me=Ie.length;q<Me;q++)if(ae=Ie[q],S.format!==1023)if(Te!==null)if(J){if(L)if(S.layerUpdates.size>0){const be=Ea(ae.width,ae.height,S.format,S.type);for(const ee of S.layerUpdates){const Ae=ae.data.subarray(ee*be/ae.data.BYTES_PER_ELEMENT,(ee+1)*be/ae.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,q,0,0,ee,ae.width,ae.height,1,Te,Ae)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,q,0,0,0,ae.width,ae.height,Z.depth,Te,ae.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,q,ye,ae.width,ae.height,Z.depth,0,ae.data,0,0);else Oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else J?L&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,q,0,0,0,ae.width,ae.height,Z.depth,Te,C,ae.data):t.texImage3D(i.TEXTURE_2D_ARRAY,q,ye,ae.width,ae.height,Z.depth,0,Te,C,ae.data)}else{J&&Ze&&t.texStorage2D(i.TEXTURE_2D,$,ye,Ie[0].width,Ie[0].height);for(let q=0,Me=Ie.length;q<Me;q++)ae=Ie[q],S.format!==1023?Te!==null?J?L&&t.compressedTexSubImage2D(i.TEXTURE_2D,q,0,0,ae.width,ae.height,Te,ae.data):t.compressedTexImage2D(i.TEXTURE_2D,q,ye,ae.width,ae.height,0,ae.data):Oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):J?L&&t.texSubImage2D(i.TEXTURE_2D,q,0,0,ae.width,ae.height,Te,C,ae.data):t.texImage2D(i.TEXTURE_2D,q,ye,ae.width,ae.height,0,Te,C,ae.data)}else if(S.isDataArrayTexture)if(J){if(Ze&&t.texStorage3D(i.TEXTURE_2D_ARRAY,$,ye,Z.width,Z.height,Z.depth),L)if(S.layerUpdates.size>0){const q=Ea(Z.width,Z.height,S.format,S.type);for(const Me of S.layerUpdates){const be=Z.data.subarray(Me*q/Z.data.BYTES_PER_ELEMENT,(Me+1)*q/Z.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Me,Z.width,Z.height,1,Te,C,be)}S.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,Te,C,Z.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,ye,Z.width,Z.height,Z.depth,0,Te,C,Z.data);else if(S.isData3DTexture)J?(Ze&&t.texStorage3D(i.TEXTURE_3D,$,ye,Z.width,Z.height,Z.depth),L&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,Te,C,Z.data)):t.texImage3D(i.TEXTURE_3D,0,ye,Z.width,Z.height,Z.depth,0,Te,C,Z.data);else if(S.isFramebufferTexture){if(Ze)if(J)t.texStorage2D(i.TEXTURE_2D,$,ye,Z.width,Z.height);else{let q=Z.width,Me=Z.height;for(let be=0;be<$;be++)t.texImage2D(i.TEXTURE_2D,be,ye,q,Me,0,Te,C,null),q>>=1,Me>>=1}}else if(S.isHTMLTexture){if("texElementImage2D"in i){const q=i.canvas;if(q.hasAttribute("layoutsubtree")||q.setAttribute("layoutsubtree","true"),Z.parentNode!==q){q.appendChild(Z),f.add(S),q.onpaint=Me=>{const be=Me.changedElements;for(const ee of f)be.includes(ee.image)&&(ee.needsUpdate=!0)},q.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,Z);else{const be=i.RGBA,ee=i.RGBA,Ae=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,be,ee,Ae,Z)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Ie.length>0){if(J&&Ze){const q=pt(Ie[0]);t.texStorage2D(i.TEXTURE_2D,$,ye,q.width,q.height)}for(let q=0,Me=Ie.length;q<Me;q++)ae=Ie[q],J?L&&t.texSubImage2D(i.TEXTURE_2D,q,0,0,Te,C,ae):t.texImage2D(i.TEXTURE_2D,q,ye,Te,C,ae);S.generateMipmaps=!1}else if(J){if(Ze){const q=pt(Z);t.texStorage2D(i.TEXTURE_2D,$,ye,q.width,q.height)}L&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Te,C,Z)}else t.texImage2D(i.TEXTURE_2D,0,ye,Te,C,Z);p(S)&&y(Y),ue.__version=he.version,S.onUpdate&&S.onUpdate(S)}A.__version=S.version}function He(A,S,B){if(S.image.length!==6)return;const Y=K(A,S),ne=S.source;t.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+B);const he=n.get(ne);if(ne.version!==he.__version||Y===!0){t.activeTexture(i.TEXTURE0+B);const ue=et.getPrimaries(et.workingColorSpace),X=S.colorSpace===""?null:et.getPrimaries(S.colorSpace),Z=S.colorSpace===""||ue===X?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Z);const Te=S.isCompressedTexture||S.image[0].isCompressedTexture,C=S.image[0]&&S.image[0].isDataTexture,ye=[];for(let ee=0;ee<6;ee++)!Te&&!C?ye[ee]=m(S.image[ee],!0,r.maxCubemapSize):ye[ee]=C?S.image[ee].image:S.image[ee],ye[ee]=rt(S,ye[ee]);const ae=ye[0],Ie=s.convert(S.format,S.colorSpace),J=s.convert(S.type),Ze=v(S.internalFormat,Ie,J,S.normalized,S.colorSpace),L=S.isVideoTexture!==!0,$=he.__version===void 0||Y===!0,q=ne.dataReady;let Me=T(S,ae);it(i.TEXTURE_CUBE_MAP,S);let be;if(Te){L&&$&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Me,Ze,ae.width,ae.height);for(let ee=0;ee<6;ee++){be=ye[ee].mipmaps;for(let Ae=0;Ae<be.length;Ae++){const Xe=be[Ae];S.format!==1023?Ie!==null?L?q&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae,0,0,Xe.width,Xe.height,Ie,Xe.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae,Ze,Xe.width,Xe.height,0,Xe.data):Oe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae,0,0,Xe.width,Xe.height,Ie,J,Xe.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae,Ze,Xe.width,Xe.height,0,Ie,J,Xe.data)}}}else{if(be=S.mipmaps,L&&$){be.length>0&&Me++;const ee=pt(ye[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Me,Ze,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(C){L?q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,ye[ee].width,ye[ee].height,Ie,J,ye[ee].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Ze,ye[ee].width,ye[ee].height,0,Ie,J,ye[ee].data);for(let Ae=0;Ae<be.length;Ae++){const mt=be[Ae].image[ee].image;L?q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae+1,0,0,mt.width,mt.height,Ie,J,mt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae+1,Ze,mt.width,mt.height,0,Ie,J,mt.data)}}else{L?q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Ie,J,ye[ee]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Ze,Ie,J,ye[ee]);for(let Ae=0;Ae<be.length;Ae++){const Xe=be[Ae];L?q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae+1,0,0,Ie,J,Xe.image[ee]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ae+1,Ze,Ie,J,Xe.image[ee])}}}p(S)&&y(i.TEXTURE_CUBE_MAP),he.__version=ne.version,S.onUpdate&&S.onUpdate(S)}A.__version=S.version}function Ge(A,S,B,Y,ne,he){const ue=s.convert(B.format,B.colorSpace),X=s.convert(B.type),Z=v(B.internalFormat,ue,X,B.normalized,B.colorSpace),Te=n.get(S),C=n.get(B);if(C.__renderTarget=S,!Te.__hasExternalTextures){const ye=Math.max(1,S.width>>he),ae=Math.max(1,S.height>>he);ne===i.TEXTURE_3D||ne===i.TEXTURE_2D_ARRAY?t.texImage3D(ne,he,Z,ye,ae,S.depth,0,ue,X,null):t.texImage2D(ne,he,Z,ye,ae,0,ue,X,null)}t.bindFramebuffer(i.FRAMEBUFFER,A),We(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,ne,C.__webglTexture,0,Ue(S)):(ne===i.TEXTURE_2D||ne>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Y,ne,C.__webglTexture,he),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ht(A,S,B){if(i.bindRenderbuffer(i.RENDERBUFFER,A),S.depthBuffer){const Y=S.depthTexture,ne=Y&&Y.isDepthTexture?Y.type:null,he=R(S.stencilBuffer,ne),ue=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;We(S)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ue(S),he,S.width,S.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ue(S),he,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,he,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ue,i.RENDERBUFFER,A)}else{const Y=S.textures;for(let ne=0;ne<Y.length;ne++){const he=Y[ne],ue=s.convert(he.format,he.colorSpace),X=s.convert(he.type),Z=v(he.internalFormat,ue,X,he.normalized,he.colorSpace);We(S)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ue(S),Z,S.width,S.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ue(S),Z,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,Z,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ve(A,S,B){const Y=S.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,A),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const ne=n.get(S.depthTexture);if(ne.__renderTarget=S,(!ne.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),Y){if(ne.__webglInit===void 0&&(ne.__webglInit=!0,S.depthTexture.addEventListener("dispose",P)),ne.__webglTexture===void 0){ne.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,ne.__webglTexture),it(i.TEXTURE_CUBE_MAP,S.depthTexture);const Te=s.convert(S.depthTexture.format),C=s.convert(S.depthTexture.type);let ye;S.depthTexture.format===1026?ye=i.DEPTH_COMPONENT24:S.depthTexture.format===1027&&(ye=i.DEPTH24_STENCIL8);for(let ae=0;ae<6;ae++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,ye,S.width,S.height,0,Te,C,null)}}else Q(S.depthTexture,0);const he=ne.__webglTexture,ue=Ue(S),X=Y?i.TEXTURE_CUBE_MAP_POSITIVE_X+B:i.TEXTURE_2D,Z=S.depthTexture.format===1027?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(S.depthTexture.format===1026)We(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,X,he,0,ue):i.framebufferTexture2D(i.FRAMEBUFFER,Z,X,he,0);else if(S.depthTexture.format===1027)We(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,X,he,0,ue):i.framebufferTexture2D(i.FRAMEBUFFER,Z,X,he,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function j(A){const S=n.get(A),B=A.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==A.depthTexture){const Y=A.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),Y){const ne=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,Y.removeEventListener("dispose",ne)};Y.addEventListener("dispose",ne),S.__depthDisposeCallback=ne}S.__boundDepthTexture=Y}if(A.depthTexture&&!S.__autoAllocateDepthBuffer)if(B)for(let Y=0;Y<6;Y++)Ve(S.__webglFramebuffer[Y],A,Y);else{const Y=A.texture.mipmaps;Y&&Y.length>0?Ve(S.__webglFramebuffer[0],A,0):Ve(S.__webglFramebuffer,A,0)}else if(B){S.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[Y]),S.__webglDepthbuffer[Y]===void 0)S.__webglDepthbuffer[Y]=i.createRenderbuffer(),ht(S.__webglDepthbuffer[Y],A,!1);else{const ne=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=S.__webglDepthbuffer[Y];i.bindRenderbuffer(i.RENDERBUFFER,he),i.framebufferRenderbuffer(i.FRAMEBUFFER,ne,i.RENDERBUFFER,he)}}else{const Y=A.texture.mipmaps;if(Y&&Y.length>0?t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),ht(S.__webglDepthbuffer,A,!1);else{const ne=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,he),i.framebufferRenderbuffer(i.FRAMEBUFFER,ne,i.RENDERBUFFER,he)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function re(A,S,B){const Y=n.get(A);S!==void 0&&Ge(Y.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&j(A)}function ie(A){const S=A.texture,B=n.get(A),Y=n.get(S);A.addEventListener("dispose",_);const ne=A.textures,he=A.isWebGLCubeRenderTarget===!0,ue=ne.length>1;if(ue||(Y.__webglTexture===void 0&&(Y.__webglTexture=i.createTexture()),Y.__version=S.version,a.memory.textures++),he){B.__webglFramebuffer=[];for(let X=0;X<6;X++)if(S.mipmaps&&S.mipmaps.length>0){B.__webglFramebuffer[X]=[];for(let Z=0;Z<S.mipmaps.length;Z++)B.__webglFramebuffer[X][Z]=i.createFramebuffer()}else B.__webglFramebuffer[X]=i.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){B.__webglFramebuffer=[];for(let X=0;X<S.mipmaps.length;X++)B.__webglFramebuffer[X]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(ue)for(let X=0,Z=ne.length;X<Z;X++){const Te=n.get(ne[X]);Te.__webglTexture===void 0&&(Te.__webglTexture=i.createTexture(),a.memory.textures++)}if(A.samples>0&&We(A)===!1){B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let X=0;X<ne.length;X++){const Z=ne[X];B.__webglColorRenderbuffer[X]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[X]);const Te=s.convert(Z.format,Z.colorSpace),C=s.convert(Z.type),ye=v(Z.internalFormat,Te,C,Z.normalized,Z.colorSpace,A.isXRRenderTarget===!0),ae=Ue(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,ae,ye,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+X,i.RENDERBUFFER,B.__webglColorRenderbuffer[X])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),ht(B.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(he){t.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture),it(i.TEXTURE_CUBE_MAP,S);for(let X=0;X<6;X++)if(S.mipmaps&&S.mipmaps.length>0)for(let Z=0;Z<S.mipmaps.length;Z++)Ge(B.__webglFramebuffer[X][Z],A,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+X,Z);else Ge(B.__webglFramebuffer[X],A,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+X,0);p(S)&&y(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ue){for(let X=0,Z=ne.length;X<Z;X++){const Te=ne[X],C=n.get(Te);let ye=i.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ye=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ye,C.__webglTexture),it(ye,Te),Ge(B.__webglFramebuffer,A,Te,i.COLOR_ATTACHMENT0+X,ye,0),p(Te)&&y(ye)}t.unbindTexture()}else{let X=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(X=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(X,Y.__webglTexture),it(X,S),S.mipmaps&&S.mipmaps.length>0)for(let Z=0;Z<S.mipmaps.length;Z++)Ge(B.__webglFramebuffer[Z],A,S,i.COLOR_ATTACHMENT0,X,Z);else Ge(B.__webglFramebuffer,A,S,i.COLOR_ATTACHMENT0,X,0);p(S)&&y(X),t.unbindTexture()}A.depthBuffer&&j(A)}function Ee(A){const S=A.textures;for(let B=0,Y=S.length;B<Y;B++){const ne=S[B];if(p(ne)){const he=E(A),ue=n.get(ne).__webglTexture;t.bindTexture(he,ue),y(he),t.unbindTexture()}}}const ge=[],Be=[];function we(A){if(A.samples>0){if(We(A)===!1){const S=A.textures,B=A.width,Y=A.height;let ne=i.COLOR_BUFFER_BIT;const he=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=n.get(A),X=S.length>1;if(X)for(let Te=0;Te<S.length;Te++)t.bindFramebuffer(i.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Te,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ue.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Te,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ue.__webglMultisampledFramebuffer);const Z=A.texture.mipmaps;Z&&Z.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ue.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ue.__webglFramebuffer);for(let Te=0;Te<S.length;Te++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(ne|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(ne|=i.STENCIL_BUFFER_BIT)),X){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ue.__webglColorRenderbuffer[Te]);const C=n.get(S[Te]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,C,0)}i.blitFramebuffer(0,0,B,Y,0,0,B,Y,ne,i.NEAREST),l===!0&&(ge.length=0,Be.length=0,ge.push(i.COLOR_ATTACHMENT0+Te),A.depthBuffer&&A.resolveDepthBuffer===!1&&(ge.push(he),Be.push(he),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Be)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ge))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),X)for(let Te=0;Te<S.length;Te++){t.bindFramebuffer(i.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Te,i.RENDERBUFFER,ue.__webglColorRenderbuffer[Te]);const C=n.get(S[Te]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ue.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Te,i.TEXTURE_2D,C,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ue.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const S=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}}function Ue(A){return Math.min(r.maxSamples,A.samples)}function We(A){const S=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function tt(A){const S=a.render.frame;u.get(A)!==S&&(u.set(A,S),A.update())}function rt(A,S){const B=A.colorSpace,Y=A.format,ne=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||B!==fr&&B!==""&&(et.getTransfer(B)===lt?(Y!==1023||ne!==1009)&&Oe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):je("WebGLTextures: Unsupported texture color space:",B)),S}function pt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=H,this.resetTextureUnits=k,this.getTextureUnits=W,this.setTextureUnits=V,this.setTexture2D=Q,this.setTexture2DArray=se,this.setTexture3D=ce,this.setTextureCube=me,this.rebindTextures=re,this.setupRenderTarget=ie,this.updateRenderTargetMipmap=Ee,this.updateMultisampleRenderTarget=we,this.setupDepthRenderbuffer=j,this.setupFrameBufferTexture=Ge,this.useMultisampledRTT=We,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Sp(i,e){function t(n,r=""){let s;const a=et.getTransfer(r);if(n===1009)return i.UNSIGNED_BYTE;if(n===1017)return i.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return i.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return i.BYTE;if(n===1011)return i.SHORT;if(n===1012)return i.UNSIGNED_SHORT;if(n===1013)return i.INT;if(n===1014)return i.UNSIGNED_INT;if(n===1015)return i.FLOAT;if(n===1016)return i.HALF_FLOAT;if(n===1021)return i.ALPHA;if(n===1022)return i.RGB;if(n===1023)return i.RGBA;if(n===1026)return i.DEPTH_COMPONENT;if(n===1027)return i.DEPTH_STENCIL;if(n===1028)return i.RED;if(n===1029)return i.RED_INTEGER;if(n===1030)return i.RG;if(n===1031)return i.RG_INTEGER;if(n===1033)return i.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779)if(a===lt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===33776)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===33776)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===35840||n===35841||n===35842||n===35843)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===35840)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===36196||n===37492)return a===lt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===37496)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return s.COMPRESSED_R11_EAC;if(n===37489)return s.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return s.COMPRESSED_RG11_EAC;if(n===37491)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===37808)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===36492||n===36494||n===36495)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===36492)return a===lt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===36283||n===36284||n===36285||n===36286)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===36283)return s.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===1020?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const Mp=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,yp=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Ep{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new eo(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new $t({vertexShader:Mp,fragmentShader:yp,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Dt(new vr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Tp extends Dn{constructor(e,t){super();const n=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,u=null,f=null,h=null,d=null,g=null;const M=typeof XRWebGLBinding<"u",m=new Ep,p={},y=t.getContextAttributes();let E=null,v=null;const R=[],T=[],P=new le;let _=null;const b=new Vt;b.viewport=new dt;const w=new Vt;w.viewport=new dt;const F=[b,w],U=new Pc;let k=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let _e=R[K];return _e===void 0&&(_e=new wr,R[K]=_e),_e.getTargetRaySpace()},this.getControllerGrip=function(K){let _e=R[K];return _e===void 0&&(_e=new wr,R[K]=_e),_e.getGripSpace()},this.getHand=function(K){let _e=R[K];return _e===void 0&&(_e=new wr,R[K]=_e),_e.getHandSpace()};function V(K){const _e=T.indexOf(K.inputSource);if(_e===-1)return;const fe=R[_e];fe!==void 0&&(fe.update(K.inputSource,K.frame,c||a),fe.dispatchEvent({type:K.type,data:K.inputSource}))}function H(){r.removeEventListener("select",V),r.removeEventListener("selectstart",V),r.removeEventListener("selectend",V),r.removeEventListener("squeeze",V),r.removeEventListener("squeezestart",V),r.removeEventListener("squeezeend",V),r.removeEventListener("end",H),r.removeEventListener("inputsourceschange",z);for(let K=0;K<R.length;K++){const _e=T[K];_e!==null&&(T[K]=null,R[K].disconnect(_e))}k=null,W=null,m.reset();for(const K in p)delete p[K];e.setRenderTarget(E),d=null,h=null,f=null,r=null,v=null,it.stop(),n.isPresenting=!1,e.setPixelRatio(_),e.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){s=K,n.isPresenting===!0&&Oe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,n.isPresenting===!0&&Oe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return f===null&&M&&(f=new XRWebGLBinding(r,t)),f},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(K){if(r=K,r!==null){if(E=e.getRenderTarget(),r.addEventListener("select",V),r.addEventListener("selectstart",V),r.addEventListener("selectend",V),r.addEventListener("squeeze",V),r.addEventListener("squeezestart",V),r.addEventListener("squeezeend",V),r.addEventListener("end",H),r.addEventListener("inputsourceschange",z),y.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(P),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let fe=null,Ne=null,He=null;y.depth&&(He=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,fe=y.stencil?1027:1026,Ne=y.stencil?1020:1014);const Ge={colorFormat:t.RGBA8,depthFormat:He,scaleFactor:s};f=this.getBinding(),h=f.createProjectionLayer(Ge),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),v=new Kt(h.textureWidth,h.textureHeight,{format:1023,type:1009,depthTexture:new ai(h.textureWidth,h.textureHeight,Ne,void 0,void 0,void 0,void 0,void 0,void 0,fe),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{const fe={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(r,t,fe),r.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),v=new Kt(d.framebufferWidth,d.framebufferHeight,{format:1023,type:1009,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),it.setContext(r),it.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function z(K){for(let _e=0;_e<K.removed.length;_e++){const fe=K.removed[_e],Ne=T.indexOf(fe);Ne>=0&&(T[Ne]=null,R[Ne].disconnect(fe))}for(let _e=0;_e<K.added.length;_e++){const fe=K.added[_e];let Ne=T.indexOf(fe);if(Ne===-1){for(let Ge=0;Ge<R.length;Ge++)if(Ge>=T.length){T.push(fe),Ne=Ge;break}else if(T[Ge]===null){T[Ge]=fe,Ne=Ge;break}if(Ne===-1)break}const He=R[Ne];He&&He.connect(fe)}}const Q=new D,se=new D;function ce(K,_e,fe){Q.setFromMatrixPosition(_e.matrixWorld),se.setFromMatrixPosition(fe.matrixWorld);const Ne=Q.distanceTo(se),He=_e.projectionMatrix.elements,Ge=fe.projectionMatrix.elements,ht=He[14]/(He[10]-1),Ve=He[14]/(He[10]+1),j=(He[9]+1)/He[5],re=(He[9]-1)/He[5],ie=(He[8]-1)/He[0],Ee=(Ge[8]+1)/Ge[0],ge=ht*ie,Be=ht*Ee,we=Ne/(-ie+Ee),Ue=we*-ie;if(_e.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(Ue),K.translateZ(we),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),He[10]===-1)K.projectionMatrix.copy(_e.projectionMatrix),K.projectionMatrixInverse.copy(_e.projectionMatrixInverse);else{const We=ht+we,tt=Ve+we,rt=ge-Ue,pt=Be+(Ne-Ue),A=j*Ve/tt*We,S=re*Ve/tt*We;K.projectionMatrix.makePerspective(rt,pt,A,S,We,tt),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function me(K,_e){_e===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(_e.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(r===null)return;let _e=K.near,fe=K.far;m.texture!==null&&(m.depthNear>0&&(_e=m.depthNear),m.depthFar>0&&(fe=m.depthFar)),U.near=w.near=b.near=_e,U.far=w.far=b.far=fe,(k!==U.near||W!==U.far)&&(r.updateRenderState({depthNear:U.near,depthFar:U.far}),k=U.near,W=U.far),U.layers.mask=K.layers.mask|6,b.layers.mask=U.layers.mask&-5,w.layers.mask=U.layers.mask&-3;const Ne=K.parent,He=U.cameras;me(U,Ne);for(let Ge=0;Ge<He.length;Ge++)me(He[Ge],Ne);He.length===2?ce(U,b,w):U.projectionMatrix.copy(b.projectionMatrix),Re(K,U,Ne)};function Re(K,_e,fe){fe===null?K.matrix.copy(_e.matrixWorld):(K.matrix.copy(fe.matrixWorld),K.matrix.invert(),K.matrix.multiply(_e.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(_e.projectionMatrix),K.projectionMatrixInverse.copy(_e.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=wi*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(h===null&&d===null))return l},this.setFoveation=function(K){l=K,h!==null&&(h.fixedFoveation=K),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=K)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(U)},this.getCameraTexture=function(K){return p[K]};let Qe=null;function st(K,_e){if(u=_e.getViewerPose(c||a),g=_e,u!==null){const fe=u.views;d!==null&&(e.setRenderTargetFramebuffer(v,d.framebuffer),e.setRenderTarget(v));let Ne=!1;fe.length!==U.cameras.length&&(U.cameras.length=0,Ne=!0);for(let Ve=0;Ve<fe.length;Ve++){const j=fe[Ve];let re=null;if(d!==null)re=d.getViewport(j);else{const Ee=f.getViewSubImage(h,j);re=Ee.viewport,Ve===0&&(e.setRenderTargetTextures(v,Ee.colorTexture,Ee.depthStencilTexture),e.setRenderTarget(v))}let ie=F[Ve];ie===void 0&&(ie=new Vt,ie.layers.enable(Ve),ie.viewport=new dt,F[Ve]=ie),ie.matrix.fromArray(j.transform.matrix),ie.matrix.decompose(ie.position,ie.quaternion,ie.scale),ie.projectionMatrix.fromArray(j.projectionMatrix),ie.projectionMatrixInverse.copy(ie.projectionMatrix).invert(),ie.viewport.set(re.x,re.y,re.width,re.height),Ve===0&&(U.matrix.copy(ie.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),Ne===!0&&U.cameras.push(ie)}const He=r.enabledFeatures;if(He&&He.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&M){f=n.getBinding();const Ve=f.getDepthInformation(fe[0]);Ve&&Ve.isValid&&Ve.texture&&m.init(Ve,r.renderState)}if(He&&He.includes("camera-access")&&M){e.state.unbindTexture(),f=n.getBinding();for(let Ve=0;Ve<fe.length;Ve++){const j=fe[Ve].camera;if(j){let re=p[j];re||(re=new eo,p[j]=re);const ie=f.getCameraImage(j);re.sourceTexture=ie}}}}for(let fe=0;fe<R.length;fe++){const Ne=T[fe],He=R[fe];Ne!==null&&He!==void 0&&He.update(Ne,_e,c||a)}Qe&&Qe(K,_e),_e.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:_e}),g=null}const it=new bo;it.setAnimationLoop(st),this.setAnimationLoop=function(K){Qe=K},this.dispose=function(){}}}const bp=new ot,Do=new qe;Do.set(-1,0,0,0,1,0,0,0,1);function Ap(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Mo(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,y,E,v){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?s(m,p):p.isMeshLambertMaterial?(s(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(s(m,p),f(m,p)):p.isMeshPhongMaterial?(s(m,p),u(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(s(m,p),h(m,p),p.isMeshPhysicalMaterial&&d(m,p,v)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),M(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,y,E):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===1&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===1&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const y=e.get(p),E=y.envMap,v=y.envMapRotation;E&&(m.envMap.value=E,m.envMapRotation.value.setFromMatrix4(bp.makeRotationFromEuler(v)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Do),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,y,E){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*y,m.scale.value=E*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,y){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===1&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function M(m,p){const y=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function Rp(i,e,t,n){let r={},s={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,R){const T=R.program;n.uniformBlockBinding(v,T)}function c(v,R){let T=r[v.id];T===void 0&&(m(v),T=u(v),r[v.id]=T,v.addEventListener("dispose",y));const P=R.program;n.updateUBOMapping(v,P);const _=e.render.frame;s[v.id]!==_&&(h(v),s[v.id]=_)}function u(v){const R=f();v.__bindingPointIndex=R;const T=i.createBuffer(),P=v.__size,_=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,P,_),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,R,T),T}function f(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return je("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){const R=r[v.id],T=v.uniforms,P=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,R);for(let _=0,b=T.length;_<b;_++){const w=T[_];if(Array.isArray(w))for(let F=0,U=w.length;F<U;F++)d(w[F],_,F,P);else d(w,_,0,P)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(v,R,T,P){if(M(v,R,T,P)===!0){const _=v.__offset,b=v.value;if(Array.isArray(b)){let w=0;for(let F=0;F<b.length;F++){const U=b[F],k=p(U);g(U,v.__data,w),typeof U!="number"&&typeof U!="boolean"&&!U.isMatrix3&&!ArrayBuffer.isView(U)&&(w+=k.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(b,v.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,_,v.__data)}}function g(v,R,T){typeof v=="number"||typeof v=="boolean"?R[0]=v:v.isMatrix3?(R[0]=v.elements[0],R[1]=v.elements[1],R[2]=v.elements[2],R[3]=0,R[4]=v.elements[3],R[5]=v.elements[4],R[6]=v.elements[5],R[7]=0,R[8]=v.elements[6],R[9]=v.elements[7],R[10]=v.elements[8],R[11]=0):ArrayBuffer.isView(v)?R.set(new v.constructor(v.buffer,v.byteOffset,R.length)):v.toArray(R,T)}function M(v,R,T,P){const _=v.value,b=R+"_"+T;if(P[b]===void 0)return typeof _=="number"||typeof _=="boolean"?P[b]=_:ArrayBuffer.isView(_)?P[b]=_.slice():P[b]=_.clone(),!0;{const w=P[b];if(typeof _=="number"||typeof _=="boolean"){if(w!==_)return P[b]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(w.equals(_)===!1)return w.copy(_),!0}}return!1}function m(v){const R=v.uniforms;let T=0;const P=16;for(let b=0,w=R.length;b<w;b++){const F=Array.isArray(R[b])?R[b]:[R[b]];for(let U=0,k=F.length;U<k;U++){const W=F[U],V=Array.isArray(W.value)?W.value:[W.value];for(let H=0,z=V.length;H<z;H++){const Q=V[H],se=p(Q),ce=T%P,me=ce%se.boundary,Re=ce+me;T+=me,Re!==0&&P-Re<se.storage&&(T+=P-Re),W.__data=new Float32Array(se.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=T,T+=se.storage}}}const _=T%P;return _>0&&(T+=P-_),v.__size=T,v.__cache={},this}function p(v){const R={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(R.boundary=4,R.storage=4):v.isVector2?(R.boundary=8,R.storage=8):v.isVector3||v.isColor?(R.boundary=16,R.storage=12):v.isVector4?(R.boundary=16,R.storage=16):v.isMatrix3?(R.boundary=48,R.storage=48):v.isMatrix4?(R.boundary=64,R.storage=64):v.isTexture?Oe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(R.boundary=16,R.storage=v.byteLength):Oe("WebGLRenderer: Unsupported uniform value type.",v),R}function y(v){const R=v.target;R.removeEventListener("dispose",y);const T=a.indexOf(R.__bindingPointIndex);a.splice(T,1),i.deleteBuffer(r[R.id]),delete r[R.id],delete s[R.id]}function E(){for(const v in r)i.deleteBuffer(r[v]);a=[],r={},s={}}return{bind:l,update:c,dispose:E}}const Cp=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Zt=null;function wp(){return Zt===null&&(Zt=new pr(Cp,16,16,1030,1016),Zt.name="DFG_LUT",Zt.minFilter=1006,Zt.magFilter=1006,Zt.wrapS=1001,Zt.wrapT=1001,Zt.generateMipmaps=!1,Zt.needsUpdate=!0),Zt}class Hm{constructor(e={}){const{canvas:t=zo(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:h=!1,outputBufferType:d=1009}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const M=d,m=new Set([1033,1031,1029]),p=new Set([1009,1014,1012,1020,1017,1018]),y=new Uint32Array(4),E=new Int32Array(4),v=new D;let R=null,T=null;const P=[],_=[];let b=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const w=this;let F=!1,U=null,k=null,W=null,V=null;this._outputColorSpace=Gt;let H=0,z=0,Q=null,se=-1,ce=!1,me=null;const Re=new WeakMap,Qe=new WeakMap,st=new Ye,it=new dt,K=new ot,_e=new dt;function fe(x,I,O,N){let G=O,oe=N,de=0,te=0,ve=!1;for(const{object:xe,geometry:Pe,material:ke}of x){if(!w.transmissionForeground?.has(xe))continue;if(xe.isSkinnedMesh||xe.isInstancedMesh||xe.morphTargetInfluences||ke.displacementMap)return _e.set(0,0,O,N);Pe.boundingBox||Pe.computeBoundingBox();const Fe=Pe.boundingBox;K.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse).multiply(xe.matrixWorld);for(let Je=0;Je<8;Je++){const Ce=it.set(Je&1?Fe.max.x:Fe.min.x,Je&2?Fe.max.y:Fe.min.y,Je&4?Fe.max.z:Fe.min.z,1).applyMatrix4(K);if(Ce.w<=0||Ce.z<-Ce.w||!Number.isFinite(Ce.x+Ce.y+Ce.z+Ce.w))return _e.set(0,0,O,N);const Le=(Ce.x/Ce.w+1)*O*.5,De=(Ce.y/Ce.w+1)*N*.5;G=Math.min(G,Le),oe=Math.min(oe,De),de=Math.max(de,Le),te=Math.max(te,De),ve=!0}}return ve?(G=Math.max(0,Math.floor(G)-2),oe=Math.max(0,Math.floor(oe)-2),de=Math.min(O,Math.ceil(de)+2),te=Math.min(N,Math.ceil(te)+2),_e.set(G,oe,Math.max(0,de-G),Math.max(0,te-oe))):_e.set(0,0,0,0)}const Ne=new Float32Array([0,0,0,0]),He={textures:[null,null]};function Ge(x){let I=Re.get(x);return I||(C.bindRenderbuffer(C.RENDERBUFFER,x),I=[C.getRenderbufferParameter(C.RENDERBUFFER,C.RENDERBUFFER_SAMPLES),C.getRenderbufferParameter(C.RENDERBUFFER,C.RENDERBUFFER_INTERNAL_FORMAT),C.getRenderbufferParameter(C.RENDERBUFFER,C.RENDERBUFFER_WIDTH),C.getRenderbufferParameter(C.RENDERBUFFER,C.RENDERBUFFER_HEIGHT)],C.bindRenderbuffer(C.RENDERBUFFER,null),Re.set(x,I)),I}function ht(x,I,O,N,G,oe){if(!w.musicOpaqueReuse||!I||I.isXRRenderTarget||oe.viewport||oe.isArrayCamera||G.background!==null||G.overrideMaterial!==null||!w.autoClear||!w.autoClearColor||!w.autoClearDepth||w.xr.isPresenting||I.width!==x.width||I.height!==x.height||I.samples!==x.samples||I.samples!==4||I.texture.type!==x.texture.type||I.texture.format!==x.texture.format||I.textures.length!==1||x.textures.length!==1||I.stencilBuffer||x.stencilBuffer||!I.depthBuffer||!x.depthBuffer||I.scissorTest||z!==0||H!==0||ae.has("WEBGL_multisampled_render_to_texture")||/OculusBrowser/g.test(navigator.userAgent))return!1;const de=I.viewport;if(de.x!==0||de.y!==0||de.z!==I.width||de.w!==I.height)return!1;const te=st;w.getClearColor(te);const ve=w.getClearAlpha();if(te.r!==0||te.g!==0||te.b!==0||ve!==0||N.some(Le=>Le.material.side===2)||O.some(({object:Le,material:De})=>!De.isMeshStandardMaterial&&!De.isMeshBasicMaterial||De.blending!==1||De.transparent||Le.onBeforeRender!==Dt.prototype.onBeforeRender||Le.onAfterRender!==Dt.prototype.onAfterRender||De.onBeforeRender!==ii.prototype.onBeforeRender||De.onBeforeCompile!==ii.prototype.onBeforeCompile))return!1;const xe=L.get(I);w.setRenderTarget(x);const Pe=L.get(x);if(!xe.__webglMultisampledFramebuffer||!Pe.__webglMultisampledFramebuffer||!xe.__webglDepthRenderbuffer||!Pe.__webglDepthRenderbuffer)return w.setRenderTarget(I),!1;const ke=(Le,De)=>{const at=Ge(Le),pe=Ge(De);return at[0]===pe[0]&&at[1]===pe[1]&&at[2]===pe[2]&&at[3]===pe[3]};if(!ke(xe.__webglColorRenderbuffer[0],Pe.__webglColorRenderbuffer[0])||!ke(xe.__webglDepthRenderbuffer,Pe.__webglDepthRenderbuffer))return w.setRenderTarget(I),!1;const Fe=w.toneMapping;let Je=!1,Ce=!1;try{if(J.bindFramebuffer(C.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),C.framebufferRenderbuffer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT1,C.RENDERBUFFER,xe.__webglColorRenderbuffer[0]),C.framebufferRenderbuffer(C.FRAMEBUFFER,C.DEPTH_ATTACHMENT,C.RENDERBUFFER,xe.__webglDepthRenderbuffer),Je=!0,J.drawBuffers(He,Pe.__webglMultisampledFramebuffer),Qe.get(xe.__webglColorRenderbuffer[0])!==Pe.__webglColorRenderbuffer[0]){if(C.checkFramebufferStatus(C.FRAMEBUFFER)!==C.FRAMEBUFFER_COMPLETE)return!1;Qe.set(xe.__webglColorRenderbuffer[0],Pe.__webglColorRenderbuffer[0])}J.buffers.depth.setTest(!0),J.buffers.depth.setMask(!0),J.buffers.color.setMask(!0),w.setClearColor(16777215,.5),w.clear(),C.clearBufferfv(C.COLOR,1,Ne),w.toneMapping=0,T.setupLightsView(oe),B===!0&&_t.setGlobalState(w.clippingPlanes,oe),ce=!0,Un(O,G,oe),ce=!1,Ce=!0}finally{ce=!1,Je&&(J.bindFramebuffer(C.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),J.drawBuffers(x,Pe.__webglMultisampledFramebuffer),C.framebufferRenderbuffer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT1,C.RENDERBUFFER,null),C.framebufferRenderbuffer(C.FRAMEBUFFER,C.DEPTH_ATTACHMENT,C.RENDERBUFFER,Pe.__webglDepthRenderbuffer)),w.toneMapping=Fe,w.setClearColor(te,ve),Ce||w.setRenderTarget(I)}try{const Le=fe(O,oe,x.width,x.height);if(Le.z>0&&Le.w>0)try{J.scissor(Le),J.setScissorTest(!0),J.buffers.depth.setTest(!0),J.buffers.depth.setMask(!0),J.buffers.color.setMask(!0),w.toneMapping=0,w.setClearColor(16777215,.5),w.clear(),Un(O,G,oe,!0)}finally{J.scissor(re),J.setScissorTest(ie),w.toneMapping=Fe,w.setClearColor(te,ve)}$.updateMultisampleRenderTarget(x),$.updateRenderTargetMipmap(x)}finally{w.setRenderTarget(I)}return!0}let Ve=null;const j=new dt,re=new dt;let ie=null;const Ee=new Ye(0);let ge=0,Be=t.width,we=t.height,Ue=1,We=null,tt=null;const rt=new dt(0,0,Be,we),pt=new dt(0,0,Be,we);let A=!1;const S=new ds;let B=!1,Y=!1;const ne=new ot,he=new D,ue=new dt,X={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Z=!1;function Te(){return Q===null?Ue:1}let C=n;function ye(x,I){return t.getContext(x,I)}try{const x={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r185"),t.addEventListener("webglcontextlost",ys,!1),t.addEventListener("webglcontextrestored",Es,!1),t.addEventListener("webglcontextcreationerror",Ts,!1),C===null){const I="webgl2";if(C=ye(I,x),C===null)throw ye(I)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(x){throw je("WebGLRenderer: "+x.message),x}let ae,Ie,J,Ze,L,$,q,Me,be,ee,Ae,Xe,mt,ct,_t,yt,Ut,vs,xs,Ss,jt,dn,Fi;function Ms(){ae=new wf(C),ae.init(),jt=new Sp(C,ae),Ie=new Mf(C,ae,e,jt),J=new vp(C,ae),Ie.reversedDepthBuffer&&h&&J.buffers.depth.setReversed(!0),k=C.createFramebuffer(),W=C.createFramebuffer(),V=C.createFramebuffer(),Ze=new Df(C),L=new rp,$=new xp(C,ae,J,L,Ie,jt,Ze),q=new Cf(w),Me=new Nc(C),dn=new xf(C,Me),be=new Pf(C,Me,Ze,dn),ee=new Ff(C,be,Me,dn,Ze),vs=new If(C,Ie,$),_t=new yf(L),Ae=new ip(w,q,ae,Ie,dn,_t),Xe=new Ap(w,L),mt=new ap,ct=new fp(ae),Ut=new vf(w,q,J,ee,g,l),yt=new _p(w,ee,Ie),Fi=new Rp(C,Ze,Ie,J),xs=new Sf(C,ae,Ze),Ss=new Lf(C,ae,Ze),Ze.programs=Ae.programs,w.capabilities=Ie,w.extensions=ae,w.properties=L,w.renderLists=mt,w.shadowMap=yt,w.state=J,w.info=Ze}Ms(),M!==1009&&(b=new Uf(M,t.width,t.height,o,r,s));const xt=new Tp(w,C);this.xr=xt,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){const x=ae.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){const x=ae.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return Ue},this.setPixelRatio=function(x){x!==void 0&&(Ue=x,this.setSize(Be,we,!1))},this.getSize=function(x){return x.set(Be,we)},this.setSize=function(x,I,O=!0){if(xt.isPresenting){Oe("WebGLRenderer: Can't change size while VR device is presenting.");return}Be=x,we=I,t.width=Math.floor(x*Ue),t.height=Math.floor(I*Ue),O===!0&&(t.style.width=x+"px",t.style.height=I+"px"),b!==null&&b.setSize(t.width,t.height),this.setViewport(0,0,x,I)},this.getDrawingBufferSize=function(x){return x.set(Be*Ue,we*Ue).floor()},this.setDrawingBufferSize=function(x,I,O){Be=x,we=I,Ue=O,t.width=Math.floor(x*O),t.height=Math.floor(I*O),this.setViewport(0,0,x,I)},this.setEffects=function(x){if(M===1009){je("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(x){for(let I=0;I<x.length;I++)if(x[I].isOutputPass===!0){Oe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}b.setEffects(x||[])},this.getCurrentViewport=function(x){return x.copy(j)},this.getViewport=function(x){return x.copy(rt)},this.setViewport=function(x,I,O,N){x.isVector4?rt.set(x.x,x.y,x.z,x.w):rt.set(x,I,O,N),J.viewport(j.copy(rt).multiplyScalar(Ue).round())},this.getScissor=function(x){return x.copy(pt)},this.setScissor=function(x,I,O,N){x.isVector4?pt.set(x.x,x.y,x.z,x.w):pt.set(x,I,O,N),J.scissor(re.copy(pt).multiplyScalar(Ue).round())},this.getScissorTest=function(){return A},this.setScissorTest=function(x){J.setScissorTest(A=x)},this.setOpaqueSort=function(x){We=x},this.setTransparentSort=function(x){tt=x},this.getClearColor=function(x){return x.copy(Ut.getClearColor())},this.setClearColor=function(){Ut.setClearColor(...arguments)},this.getClearAlpha=function(){return Ut.getClearAlpha()},this.setClearAlpha=function(){Ut.setClearAlpha(...arguments)},this.clear=function(x=!0,I=!0,O=!0){let N=0;if(x){let G=!1;if(Q!==null){const oe=Q.texture.format;G=m.has(oe)}if(G){const oe=Q.texture.type,de=p.has(oe),te=Ut.getClearColor(),ve=Ut.getClearAlpha(),xe=te.r,Pe=te.g,ke=te.b;de?(y[0]=xe,y[1]=Pe,y[2]=ke,y[3]=ve,C.clearBufferuiv(C.COLOR,0,y)):(E[0]=xe,E[1]=Pe,E[2]=ke,E[3]=ve,C.clearBufferiv(C.COLOR,0,E))}else N|=C.COLOR_BUFFER_BIT}I&&(N|=C.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),O&&(N|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N!==0&&C.clear(N)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(x){x.setRenderer(this),U=x},this.dispose=function(){t.removeEventListener("webglcontextlost",ys,!1),t.removeEventListener("webglcontextrestored",Es,!1),t.removeEventListener("webglcontextcreationerror",Ts,!1),Ut.dispose(),mt.dispose(),ct.dispose(),L.dispose(),q.dispose(),ee.dispose(),dn.dispose(),Fi.dispose(),Ae.dispose(),xt.dispose(),xt.removeEventListener("sessionstart",Rs),xt.removeEventListener("sessionend",Cs),Tn.stop()};function ys(x){x.preventDefault(),Os("WebGLRenderer: Context Lost."),F=!0}function Es(){Os("WebGLRenderer: Context Restored."),F=!1;const x=Ze.autoReset,I=yt.enabled,O=yt.autoUpdate,N=yt.needsUpdate,G=yt.type;Ms(),Ze.autoReset=x,yt.enabled=I,yt.autoUpdate=O,yt.needsUpdate=N,yt.type=G}function Ts(x){je("WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function bs(x){const I=x.target;I.removeEventListener("dispose",bs),Io(I)}function Io(x){Fo(x),L.remove(x)}function Fo(x){const I=L.get(x).programs;I!==void 0&&(I.forEach(function(O){Ae.releaseProgram(O)}),x.isShaderMaterial&&Ae.releaseShaderCache(x))}this.renderBufferDirect=function(x,I,O,N,G,oe){I===null&&(I=X);const de=G.isMesh&&G.matrixWorld.determinantAffine()<0,te=Oo(x,I,O,N,G);J.setMaterial(N,de);let ve=O.index,xe=1;if(N.wireframe===!0){if(ve=be.getWireframeAttribute(O),ve===void 0)return;xe=2}const Pe=O.drawRange,ke=O.attributes.position;let Fe=Pe.start*xe,Je=(Pe.start+Pe.count)*xe;oe!==null&&(Fe=Math.max(Fe,oe.start*xe),Je=Math.min(Je,(oe.start+oe.count)*xe)),ve!==null?(Fe=Math.max(Fe,0),Je=Math.min(Je,ve.count)):ke!=null&&(Fe=Math.max(Fe,0),Je=Math.min(Je,ke.count));const Ce=Je-Fe;if(Ce<0||Ce===1/0)return;dn.setup(G,N,te,O,ve);let Le,De=xs;if(ve!==null&&(Le=Me.get(ve),De=Ss,De.setIndex(Le)),G.isMesh)N.wireframe===!0?(J.setLineWidth(N.wireframeLinewidth*Te()),De.setMode(C.LINES)):De.setMode(C.TRIANGLES);else if(G.isLine){let at=N.linewidth;at===void 0&&(at=1),J.setLineWidth(at*Te()),G.isLineSegments?De.setMode(C.LINES):G.isLineLoop?De.setMode(C.LINE_LOOP):De.setMode(C.LINE_STRIP)}else G.isPoints?De.setMode(C.POINTS):G.isSprite&&De.setMode(C.TRIANGLES);if(G.isBatchedMesh)if(ae.get("WEBGL_multi_draw"))De.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const at=G._multiDrawStarts,pe=G._multiDrawCounts,It=G._multiDrawCount,nt=ve?Me.get(ve).bytesPerElement:1,Ot=L.get(N).currentProgram.getUniforms();for(let qt=0;qt<It;qt++)Ot.setValue(C,"_gl_DrawID",qt),De.render(at[qt]/nt,pe[qt])}else if(G.isInstancedMesh)De.renderInstances(Fe,Ce,G.count);else if(O.isInstancedBufferGeometry){const at=O._maxInstanceCount!==void 0?O._maxInstanceCount:1/0,pe=Math.min(O.instanceCount,at);De.renderInstances(Fe,Ce,pe)}else De.render(Fe,Ce)};function As(x,I,O){x.transparent===!0&&x.side===2&&x.forceSinglePass===!1?(x.side=1,x.needsUpdate=!0,fi(x,I,O),x.side=0,x.needsUpdate=!0,fi(x,I,O),x.side=2):fi(x,I,O)}this.compile=function(x,I,O=null){O===null&&(O=x),T=ct.get(O),T.init(I),_.push(T),O.traverseVisible(function(G){G.isLight&&G.layers.test(I.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),x!==O&&x.traverseVisible(function(G){G.isLight&&G.layers.test(I.layers)&&(T.pushLight(G),G.castShadow&&T.pushShadow(G))}),T.setupLights();const N=new Set;return x.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const oe=G.material;if(oe)if(Array.isArray(oe))for(let de=0;de<oe.length;de++){const te=oe[de];As(te,O,G),N.add(te)}else As(oe,O,G),N.add(oe)}),T=_.pop(),N},this.prepareMusicOpaqueAsync=function(x,I){const O=w.getRenderTarget(),N=()=>w.compileAsync(x,I);if(!w.musicOpaqueReuse||!x.isScene||!O||O.isXRRenderTarget||O.isWebGLCubeRenderTarget||I.viewport||I.isArrayCamera||x.background!==null||x.overrideMaterial!==null||!w.autoClear||!w.autoClearColor||!w.autoClearDepth||w.xr.isPresenting||O.samples!==4||O.samples!==Math.max(4,Ie.samples)||O.textures.length!==1||O.stencilBuffer||!O.depthBuffer||O.scissorTest||z!==0||H!==0||w.transmissionResolutionScale!==1||w.localClippingEnabled||w.clippingPlanes.length>0||ae.has("WEBGL_multisampled_render_to_texture")||/OculusBrowser/g.test(navigator.userAgent))return N();const G=ae.has("EXT_color_buffer_half_float")||ae.has("EXT_color_buffer_float")?1016:1009;if(O.texture.type!==G||O.texture.format!==1023)return N();const oe=O.viewport;if(oe.x!==0||oe.y!==0||oe.z!==O.width||oe.w!==O.height||(w.getClearColor(st),st.r!==0||st.g!==0||st.b!==0||w.getClearAlpha()!==0))return N();const de=[];let te=!0,ve=!1;if(x.traverse(Ce=>{if(!(Ce.isMesh||Ce.isPoints||Ce.isLine||Ce.isSprite)||!Ce.layers.test(I.layers))return;const Le=Array.isArray(Ce.material)?Ce.material:[Ce.material];for(const De of Le)!De||!De.visible||(De.transmission>0?(ve=!0,De.side===2&&(te=!1)):De.transparent||((!De.isMeshStandardMaterial&&!De.isMeshBasicMaterial||De.blending!==1||Ce.onBeforeRender!==Dt.prototype.onBeforeRender||Ce.onAfterRender!==Dt.prototype.onAfterRender||De.onBeforeRender!==ii.prototype.onBeforeRender||De.onBeforeCompile!==ii.prototype.onBeforeCompile)&&(te=!1),de.push({object:Ce,material:De})))}),!te||!ve||de.length===0)return N();const xe=new Set,Pe=me,ke=ce,Fe=T,Je=_.length;try{me=xe,ce=!1,w.compile(x,I),ce=!0;for(const{object:Ce,material:Le}of de)fi(Le,x,Ce)}finally{ce=ke,me=Pe,T=Fe,_.length=Je}return new Promise((Ce,Le)=>{function De(){try{for(const at of xe)(at.program===void 0||at.isReady())&&xe.delete(at);if(xe.size===0){Ce(x);return}setTimeout(De,10)}catch(at){Le(at)}}ae.get("KHR_parallel_shader_compile")!==null?De():setTimeout(De,10)})},this.compileAsync=function(x,I,O=null){const N=this.compile(x,I,O);return new Promise(G=>{function oe(){if(N.forEach(function(de){L.get(de).currentProgram.isReady()&&N.delete(de)}),N.size===0){G(x);return}setTimeout(oe,10)}ae.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let yr=null;function No(x){yr&&yr(x)}function Rs(){Tn.stop()}function Cs(){Tn.start()}const Tn=new bo;Tn.setAnimationLoop(No),typeof self<"u"&&Tn.setContext(self),this.setAnimationLoop=function(x){yr=x,xt.setAnimationLoop(x),x===null?Tn.stop():Tn.start()},xt.addEventListener("sessionstart",Rs),xt.addEventListener("sessionend",Cs),this.render=function(x,I){if(I!==void 0&&I.isCamera!==!0){je("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===!0)return;U!==null&&U.renderStart(x,I);const O=xt.enabled===!0&&xt.isPresenting===!0,N=b!==null&&(Q===null||O)&&b.begin(w,Q);if(x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),xt.enabled===!0&&xt.isPresenting===!0&&(b===null||b.isCompositing()===!1)&&(xt.cameraAutoUpdate===!0&&xt.updateCamera(I),I=xt.getCamera()),x.isScene===!0&&x.onBeforeRender(w,x,I,Q),T=ct.get(x,_.length),T.init(I),T.state.textureUnits=$.getTextureUnits(),_.push(T),ne.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),S.setFromProjectionMatrix(ne,2e3,I.reversedDepth),Y=this.localClippingEnabled,B=_t.init(this.clippingPlanes,Y),R=mt.get(x,P.length),R.init(),P.push(R),xt.enabled===!0&&xt.isPresenting===!0){const de=w.xr.getDepthSensingMesh();de!==null&&Er(de,I,-1/0,w.sortObjects)}Er(x,I,0,w.sortObjects),R.finish(),w.sortObjects===!0&&R.sort(We,tt,I.reversedDepth),Z=xt.enabled===!1||xt.isPresenting===!1||xt.hasDepthSensing()===!1,Z&&Ut.addToRenderList(R,x),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),B===!0&&_t.beginShadows();const G=T.state.shadowsArray;if(yt.render(G,x,I),B===!0&&_t.endShadows(),(N&&b.hasRenderPass())===!1){const de=R.opaque,te=R.transmissive;if(T.setupLights(),I.isArrayCamera){const ve=I.cameras;if(te.length>0)for(let xe=0,Pe=ve.length;xe<Pe;xe++){const ke=ve[xe];Ps(de,te,x,ke)}Z&&Ut.render(x);for(let xe=0,Pe=ve.length;xe<Pe;xe++){const ke=ve[xe];ws(R,x,ke,ke.viewport)}}else{const ve=te.length>0&&Ps(de,te,x,I)===!0;Z&&!ve&&Ut.render(x),ws(R,x,I,void 0,ve)}}Q!==null&&z===0&&($.updateMultisampleRenderTarget(Q),$.updateRenderTargetMipmap(Q)),N&&b.end(w),x.isScene===!0&&x.onAfterRender(w,x,I),dn.resetDefaultState(),se=-1,Ve=null,_.pop(),_.length>0?(T=_[_.length-1],$.setTextureUnits(T.state.textureUnits),B===!0&&_t.setGlobalState(w.clippingPlanes,T.state.camera)):T=null,P.pop(),P.length>0?R=P[P.length-1]:R=null,U!==null&&U.renderEnd()};function Er(x,I,O,N){if(x.visible===!1)return;if(x.layers.test(I.layers)){if(x.isGroup)O=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(I);else if(x.isLightProbeGrid)T.pushLightProbeGrid(x);else if(x.isLight)T.pushLight(x),x.castShadow&&T.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||S.intersectsSprite(x)){N&&ue.setFromMatrixPosition(x.matrixWorld).applyMatrix4(ne);const de=ee.update(x),te=x.material;te.visible&&R.push(x,de,te,O,ue.z,null)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||S.intersectsObject(x))){const de=ee.update(x),te=x.material;if(N&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),ue.copy(x.boundingSphere.center)):(de.boundingSphere===null&&de.computeBoundingSphere(),ue.copy(de.boundingSphere.center)),ue.applyMatrix4(x.matrixWorld).applyMatrix4(ne)),Array.isArray(te)){const ve=de.groups;for(let xe=0,Pe=ve.length;xe<Pe;xe++){const ke=ve[xe],Fe=te[ke.materialIndex];Fe&&Fe.visible&&R.push(x,de,Fe,O,ue.z,ke)}}else te.visible&&R.push(x,de,te,O,ue.z,null)}}const oe=x.children;for(let de=0,te=oe.length;de<te;de++)Er(oe[de],I,O,N)}function ws(x,I,O,N,G=!1){const{opaque:oe,transmissive:de,transparent:te}=x;T.setupLightsView(O),B===!0&&_t.setGlobalState(w.clippingPlanes,O),N&&J.viewport(j.copy(N)),oe.length>0&&!G&&Un(oe,I,O),de.length>0&&Un(de,I,O),te.length>0&&Un(te,I,O),J.buffers.depth.setTest(!0),J.buffers.depth.setMask(!0),J.buffers.color.setMask(!0),J.setPolygonOffset(!1)}function Ps(x,I,O,N){if((O.isScene===!0?O.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[N.id]===void 0){const Fe=ae.has("EXT_color_buffer_half_float")||ae.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[N.id]=new Kt(1,1,{generateMipmaps:!0,type:Fe?1016:1009,minFilter:1008,samples:Math.max(4,Ie.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:et.workingColorSpace})}const oe=T.state.transmissionRenderTarget[N.id],de=N.viewport||j;oe.setSize(de.z*w.transmissionResolutionScale,de.w*w.transmissionResolutionScale);const te=w.getRenderTarget(),ve=w.getActiveCubeFace(),xe=w.getActiveMipmapLevel();if(ht(oe,te,x,I,O,N))return!0;w.setRenderTarget(oe),w.getClearColor(Ee),ge=w.getClearAlpha(),ge<1&&w.setClearColor(16777215,.5),w.clear(),Z&&Ut.render(O);const Pe=w.toneMapping;w.toneMapping=0;const ke=N.viewport;if(N.viewport!==void 0&&(N.viewport=void 0),T.setupLightsView(N),B===!0&&_t.setGlobalState(w.clippingPlanes,N),Un(x,O,N,!0),$.updateMultisampleRenderTarget(oe),$.updateRenderTargetMipmap(oe),ae.has("WEBGL_multisampled_render_to_texture")===!1){let Fe=!1;for(let Je=0,Ce=I.length;Je<Ce;Je++){const Le=I[Je],{object:De,geometry:at,material:pe,group:It}=Le;if(pe.side===2&&De.layers.test(N.layers)){const nt=pe.side;pe.side=1,pe.needsUpdate=!0,Ls(De,O,N,at,pe,It),pe.side=nt,pe.needsUpdate=!0,Fe=!0}}Fe===!0&&($.updateMultisampleRenderTarget(oe),$.updateRenderTargetMipmap(oe))}w.setRenderTarget(te,ve,xe),w.setClearColor(Ee,ge),ke!==void 0&&(N.viewport=ke),w.toneMapping=Pe}function Un(x,I,O,N=!1){const G=I.isScene===!0?I.overrideMaterial:null;for(let oe=0,de=x.length;oe<de;oe++){const te=x[oe],{object:ve,geometry:xe,group:Pe}=te;if(N&&w.transmissionForeground?.has(ve))continue;let ke=te.material;ke.allowOverride===!0&&G!==null&&(ke=G),ve.layers.test(O.layers)&&Ls(ve,I,O,xe,ke,Pe)}}function Ls(x,I,O,N,G,oe){x.onBeforeRender(w,I,O,N,G,oe),x.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),G.onBeforeRender(w,I,O,N,x,oe),G.transparent===!0&&G.side===2&&G.forceSinglePass===!1?(G.side=1,G.needsUpdate=!0,w.renderBufferDirect(O,I,N,G,x,oe),G.side=0,G.needsUpdate=!0,w.renderBufferDirect(O,I,N,G,x,oe),G.side=2):w.renderBufferDirect(O,I,N,G,x,oe),x.onAfterRender(w,I,O,N,G,oe)}function fi(x,I,O){I.isScene!==!0&&(I=X);const N=L.get(x),G=T.state.lights,oe=T.state.shadowsArray,de=G.state.version,te=Ae.getParameters(x,G.state,oe,I,O,T.state.lightProbeGridArray),ve=!!x.userData.musicDiffuseField&&x.userData.musicDiffuseField.musicDiffuseFieldActive.value>.5&&x.userData.musicDiffuseField.musicDiffuseProbe.value>.5;N.musicDiffuseEnabled=ve;const xe=ve&&x.userData.musicDiffuseField.musicClearcoatActive.value>.5;N.musicCoatEnabled=xe;const Pe=w.musicRectLTCShared===!0&&x.isMeshStandardMaterial===!0;N.musicRectShared=Pe;const ke=Ae.getProgramCacheKey(te)+(ce?"-music-dual-opaque-v1":"")+(Pe?"-music-shared-rect-v1":"")+(ve?"-music-diffuse-field-v4":"")+(xe?"-music-coat-field-v1":"");N.musicOpaqueDrawing=ce;let Fe=N.programs;N.environment=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?I.environment:null,N.fog=I.fog;const Je=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap;N.envMap=q.get(x.envMap||N.environment,Je),N.envMapRotation=N.environment!==null&&x.envMap===null?I.environmentRotation:x.envMapRotation,Fe===void 0&&(x.addEventListener("dispose",bs),Fe=new Map,N.programs=Fe);let Ce=Fe.get(ke);if(me&&Ce!==void 0&&me.add(Ce),Ce!==void 0){if(N.currentProgram===Ce&&N.lightsStateVersion===de)return Is(x,te),Ce}else{if(te.uniforms=Ae.getUniforms(x),U!==null&&x.isNodeMaterial&&U.build(x,O,te),x.onBeforeCompile(te,w),x.userData.musicDiffuseField&&Object.assign(te.uniforms,x.userData.musicDiffuseField),ve&&(te.defines={...te.defines,MUSIC_DIFFUSE_FIELD:1}),xe&&(te.defines={...te.defines,MUSIC_CLEARCOAT_FIELD:1}),Pe&&(te.defines={...te.defines,MUSIC_RECT_LTC_SHARED:1}),ce){const De=te.fragmentShader,at=De.lastIndexOf("}"),pe=`
`;te.fragmentShader="layout(location = 1) out highp vec4 musicMainColor;"+pe+De.slice(0,at)+pe+"musicMainColor = gl_FragColor;"+pe+De.slice(at)}Ce=Ae.acquireProgram(te,ke),me&&me.add(Ce),Fe.set(ke,Ce),N.uniforms=te.uniforms}const Le=N.uniforms;return(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(Le.clippingPlanes=_t.uniform),Is(x,te),N.needsLights=Go(x),N.lightsStateVersion=de,N.needsLights&&(Le.ambientLightColor.value=G.state.ambient,Le.lightProbe.value=G.state.probe,Le.directionalLights.value=G.state.directional,Le.directionalLightShadows.value=G.state.directionalShadow,Le.spotLights.value=G.state.spot,Le.spotLightShadows.value=G.state.spotShadow,Le.rectAreaLights.value=G.state.rectArea,Le.ltc_1.value=G.state.rectAreaLTC1,Le.ltc_2.value=G.state.rectAreaLTC2,Le.pointLights.value=G.state.point,Le.pointLightShadows.value=G.state.pointShadow,Le.hemisphereLights.value=G.state.hemi,Le.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Le.spotLightMatrix.value=G.state.spotLightMatrix,Le.spotLightMap.value=G.state.spotLightMap,Le.pointShadowMatrix.value=G.state.pointShadowMatrix),N.lightProbeGrid=T.state.lightProbeGridArray.length>0,N.currentProgram=Ce,N.uniformsList=null,Ce}function Ds(x){if(x.uniformsList===null){const I=x.currentProgram.getUniforms();x.uniformsList=ur.seqWithValue(I.seq,x.uniforms)}return x.uniformsList}function Is(x,I){const O=L.get(x);O.outputColorSpace=I.outputColorSpace,O.batching=I.batching,O.batchingColor=I.batchingColor,O.instancing=I.instancing,O.instancingColor=I.instancingColor,O.instancingMorph=I.instancingMorph,O.skinning=I.skinning,O.morphTargets=I.morphTargets,O.morphNormals=I.morphNormals,O.morphColors=I.morphColors,O.morphTargetsCount=I.morphTargetsCount,O.numClippingPlanes=I.numClippingPlanes,O.numIntersection=I.numClipIntersection,O.vertexAlphas=I.vertexAlphas,O.vertexTangents=I.vertexTangents,O.toneMapping=I.toneMapping}function Uo(x,I){if(x.length===0)return null;if(x.length===1)return x[0].texture!==null?x[0]:null;v.setFromMatrixPosition(I.matrixWorld);for(let O=0,N=x.length;O<N;O++){const G=x[O];if(G.texture!==null&&G.boundingBox.containsPoint(v))return G}return null}function Oo(x,I,O,N,G){I.isScene!==!0&&(I=X),$.resetTextureUnits();const oe=I.fog,de=N.isMeshStandardMaterial||N.isMeshLambertMaterial||N.isMeshPhongMaterial?I.environment:null,te=Q===null?w.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:et.workingColorSpace,ve=N.isMeshStandardMaterial||N.isMeshLambertMaterial&&!N.envMap||N.isMeshPhongMaterial&&!N.envMap,xe=q.get(N.envMap||de,ve),Pe=N.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,ke=!!O.attributes.tangent&&(!!N.normalMap||N.anisotropy>0),Fe=!!O.morphAttributes.position,Je=!!O.morphAttributes.normal,Ce=!!O.morphAttributes.color;let Le=0;N.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(Le=w.toneMapping);const De=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,at=De!==void 0?De.length:0,pe=L.get(N),It=T.state.lights;if(B===!0&&(Y===!0||x!==Ve)){const ft=x===Ve&&N.id===se;_t.setState(N,x,ft)}let nt=pe.musicCoatEnabled!==(!!N.userData.musicDiffuseField&&N.userData.musicDiffuseField.musicDiffuseFieldActive.value>.5&&N.userData.musicDiffuseField.musicDiffuseProbe.value>.5&&N.userData.musicDiffuseField.musicClearcoatActive.value>.5)||pe.musicDiffuseEnabled!==(!!N.userData.musicDiffuseField&&N.userData.musicDiffuseField.musicDiffuseFieldActive.value>.5&&N.userData.musicDiffuseField.musicDiffuseProbe.value>.5)||pe.musicOpaqueDrawing!==ce||pe.musicRectShared!==(w.musicRectLTCShared===!0&&N.isMeshStandardMaterial===!0);N.version===pe.__version?(pe.needsLights&&pe.lightsStateVersion!==It.state.version||pe.outputColorSpace!==te||G.isBatchedMesh&&pe.batching===!1||!G.isBatchedMesh&&pe.batching===!0||G.isBatchedMesh&&pe.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&pe.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&pe.instancing===!1||!G.isInstancedMesh&&pe.instancing===!0||G.isSkinnedMesh&&pe.skinning===!1||!G.isSkinnedMesh&&pe.skinning===!0||G.isInstancedMesh&&pe.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&pe.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&pe.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&pe.instancingMorph===!1&&G.morphTexture!==null||pe.envMap!==xe||N.fog===!0&&pe.fog!==oe||pe.numClippingPlanes!==void 0&&(pe.numClippingPlanes!==_t.numPlanes||pe.numIntersection!==_t.numIntersection)||pe.vertexAlphas!==Pe||pe.vertexTangents!==ke||pe.morphTargets!==Fe||pe.morphNormals!==Je||pe.morphColors!==Ce||pe.toneMapping!==Le||pe.morphTargetsCount!==at||!!pe.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(nt=!0):(nt=!0,pe.__version=N.version);let Ot=pe.currentProgram;nt===!0&&(Ot=fi(N,I,G),U&&N.isNodeMaterial&&U.onUpdateProgram(N,Ot,pe));let qt=!1,pn=!1,On=!1;const ut=Ot.getUniforms(),vt=pe.uniforms;if(J.useProgram(Ot.program)&&(qt=!0,pn=!0,On=!0),N.id!==se&&(se=N.id,pn=!0),pe.needsLights){const ft=Uo(T.state.lightProbeGridArray,G);pe.lightProbeGrid!==ft&&(pe.lightProbeGrid=ft,pn=!0)}if(qt||Ve!==x){J.buffers.depth.getReversed()&&x.reversedDepth!==!0&&(x._reversedDepth=!0,x.updateProjectionMatrix()),ut.setValue(C,"projectionMatrix",x.projectionMatrix),ut.setValue(C,"viewMatrix",x.matrixWorldInverse);const gn=ut.map.cameraPosition;gn!==void 0&&gn.setValue(C,he.setFromMatrixPosition(x.matrixWorld)),Ie.logarithmicDepthBuffer&&ut.setValue(C,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(N.isMeshPhongMaterial||N.isMeshToonMaterial||N.isMeshLambertMaterial||N.isMeshBasicMaterial||N.isMeshStandardMaterial||N.isShaderMaterial)&&ut.setValue(C,"isOrthographic",x.isOrthographicCamera===!0),Ve!==x&&(Ve=x,pn=!0,On=!0)}if(pe.needsLights&&(It.state.directionalShadowMap.length>0&&ut.setValue(C,"directionalShadowMap",It.state.directionalShadowMap,$),It.state.spotShadowMap.length>0&&ut.setValue(C,"spotShadowMap",It.state.spotShadowMap,$),It.state.pointShadowMap.length>0&&ut.setValue(C,"pointShadowMap",It.state.pointShadowMap,$)),G.isSkinnedMesh){ut.setOptional(C,G,"bindMatrix"),ut.setOptional(C,G,"bindMatrixInverse");const ft=G.skeleton;ft&&(ft.boneTexture===null&&ft.computeBoneTexture(),ut.setValue(C,"boneTexture",ft.boneTexture,$))}G.isBatchedMesh&&(ut.setOptional(C,G,"batchingTexture"),ut.setValue(C,"batchingTexture",G._matricesTexture,$),ut.setOptional(C,G,"batchingIdTexture"),ut.setValue(C,"batchingIdTexture",G._indirectTexture,$),ut.setOptional(C,G,"batchingColorTexture"),G._colorsTexture!==null&&ut.setValue(C,"batchingColorTexture",G._colorsTexture,$));const mn=O.morphAttributes;if((mn.position!==void 0||mn.normal!==void 0||mn.color!==void 0)&&vs.update(G,O,Ot),(pn||pe.receiveShadow!==G.receiveShadow)&&(pe.receiveShadow=G.receiveShadow,ut.setValue(C,"receiveShadow",G.receiveShadow)),(N.isMeshStandardMaterial||N.isMeshLambertMaterial||N.isMeshPhongMaterial)&&N.envMap===null&&I.environment!==null&&(vt.envMapIntensity.value=I.environmentIntensity),vt.dfgLUT!==void 0&&(vt.dfgLUT.value=wp()),pn){if(ut.setValue(C,"toneMappingExposure",w.toneMappingExposure),pe.needsLights&&Bo(vt,On),oe&&N.fog===!0&&Xe.refreshFogUniforms(vt,oe),Xe.refreshMaterialUniforms(vt,N,Ue,we,T.state.transmissionRenderTarget[x.id]),pe.needsLights&&pe.lightProbeGrid){const ft=pe.lightProbeGrid;vt.probesSH.value=ft.texture,vt.probesMin.value.copy(ft.boundingBox.min),vt.probesMax.value.copy(ft.boundingBox.max),vt.probesResolution.value.copy(ft.resolution)}ur.upload(C,Ds(pe),vt,$)}if(N.isShaderMaterial&&N.uniformsNeedUpdate===!0&&(ur.upload(C,Ds(pe),vt,$),N.uniformsNeedUpdate=!1),N.isSpriteMaterial&&ut.setValue(C,"center",G.center),ut.setValue(C,"modelViewMatrix",G.modelViewMatrix),ut.setValue(C,"normalMatrix",G.normalMatrix),ut.setValue(C,"modelMatrix",G.matrixWorld),N.uniformsGroups!==void 0){const ft=N.uniformsGroups;for(let gn=0,Bn=ft.length;gn<Bn;gn++){const Fs=ft[gn];Fi.update(Fs,Ot),Fi.bind(Fs,Ot)}}return Ot}function Bo(x,I){x.ambientLightColor.needsUpdate=I,x.lightProbe.needsUpdate=I,x.directionalLights.needsUpdate=I,x.directionalLightShadows.needsUpdate=I,x.pointLights.needsUpdate=I,x.pointLightShadows.needsUpdate=I,x.spotLights.needsUpdate=I,x.spotLightShadows.needsUpdate=I,x.rectAreaLights.needsUpdate=I,x.hemisphereLights.needsUpdate=I}function Go(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return H},this.getActiveMipmapLevel=function(){return z},this.getRenderTarget=function(){return Q},this.setRenderTargetTextures=function(x,I,O){const N=L.get(x);N.__autoAllocateDepthBuffer=x.resolveDepthBuffer===!1,N.__autoAllocateDepthBuffer===!1&&(N.__useRenderToTexture=!1),L.get(x.texture).__webglTexture=I,L.get(x.depthTexture).__webglTexture=N.__autoAllocateDepthBuffer?void 0:O,N.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(x,I){const O=L.get(x);O.__webglFramebuffer=I,O.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(x,I=0,O=0){Q=x,H=I,z=O;let N=null,G=!1,oe=!1;if(x){const te=L.get(x);if(te.__useDefaultFramebuffer!==void 0){J.bindFramebuffer(C.FRAMEBUFFER,te.__webglFramebuffer),j.copy(x.viewport),re.copy(x.scissor),ie=x.scissorTest,J.viewport(j),J.scissor(re),J.setScissorTest(ie),se=-1;return}else if(te.__webglFramebuffer===void 0)$.setupRenderTarget(x);else if(te.__hasExternalTextures)$.rebindTextures(x,L.get(x.texture).__webglTexture,L.get(x.depthTexture).__webglTexture);else if(x.depthBuffer){const Pe=x.depthTexture;if(te.__boundDepthTexture!==Pe){if(Pe!==null&&L.has(Pe)&&(x.width!==Pe.image.width||x.height!==Pe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");$.setupDepthRenderbuffer(x)}}const ve=x.texture;(ve.isData3DTexture||ve.isDataArrayTexture||ve.isCompressedArrayTexture)&&(oe=!0);const xe=L.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(xe[I])?N=xe[I][O]:N=xe[I],G=!0):x.samples>0&&$.useMultisampledRTT(x)===!1?N=L.get(x).__webglMultisampledFramebuffer:Array.isArray(xe)?N=xe[O]:N=xe,j.copy(x.viewport),re.copy(x.scissor),ie=x.scissorTest}else j.copy(rt).multiplyScalar(Ue).floor(),re.copy(pt).multiplyScalar(Ue).floor(),ie=A;if(O!==0&&(N=k),J.bindFramebuffer(C.FRAMEBUFFER,N)&&J.drawBuffers(x,N),J.viewport(j),J.scissor(re),J.setScissorTest(ie),G){const te=L.get(x.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+I,te.__webglTexture,O)}else if(oe){const te=I;for(let ve=0;ve<x.textures.length;ve++){const xe=L.get(x.textures[ve]);C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0+ve,xe.__webglTexture,O,te)}}else if(x!==null&&O!==0){const te=L.get(x.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,te.__webglTexture,O)}se=-1},this.readRenderTargetPixels=function(x,I,O,N,G,oe,de,te=0){if(!(x&&x.isWebGLRenderTarget)){je("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ve=L.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&de!==void 0&&(ve=ve[de]),ve){J.bindFramebuffer(C.FRAMEBUFFER,ve);try{const xe=x.textures[te],Pe=xe.format,ke=xe.type;if(x.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+te),!Ie.textureFormatReadable(Pe)){je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ie.textureTypeReadable(ke)){je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=x.width-N&&O>=0&&O<=x.height-G&&C.readPixels(I,O,N,G,jt.convert(Pe),jt.convert(ke),oe)}finally{const xe=Q!==null?L.get(Q).__webglFramebuffer:null;J.bindFramebuffer(C.FRAMEBUFFER,xe)}}},this.readRenderTargetPixelsAsync=async function(x,I,O,N,G,oe,de,te=0){if(!(x&&x.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ve=L.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&de!==void 0&&(ve=ve[de]),ve)if(I>=0&&I<=x.width-N&&O>=0&&O<=x.height-G){J.bindFramebuffer(C.FRAMEBUFFER,ve);const xe=x.textures[te],Pe=xe.format,ke=xe.type;if(x.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+te),!Ie.textureFormatReadable(Pe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ie.textureTypeReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Fe=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,Fe),C.bufferData(C.PIXEL_PACK_BUFFER,oe.byteLength,C.STREAM_READ),C.readPixels(I,O,N,G,jt.convert(Pe),jt.convert(ke),0);const Je=Q!==null?L.get(Q).__webglFramebuffer:null;J.bindFramebuffer(C.FRAMEBUFFER,Je);const Ce=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await Ho(C,Ce,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,Fe),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,oe),C.deleteBuffer(Fe),C.deleteSync(Ce),oe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(x,I=null,O=0){const N=Math.pow(2,-O),G=Math.floor(x.image.width*N),oe=Math.floor(x.image.height*N),de=I!==null?I.x:0,te=I!==null?I.y:0;$.setTexture2D(x,0),C.copyTexSubImage2D(C.TEXTURE_2D,O,0,0,de,te,G,oe),J.unbindTexture()},this.copyTextureToTexture=function(x,I,O=null,N=null,G=0,oe=0){let de,te,ve,xe,Pe,ke,Fe,Je,Ce;const Le=x.isCompressedTexture?x.mipmaps[oe]:x.image;if(O!==null)de=O.max.x-O.min.x,te=O.max.y-O.min.y,ve=O.isBox3?O.max.z-O.min.z:1,xe=O.min.x,Pe=O.min.y,ke=O.isBox3?O.min.z:0;else{const vt=Math.pow(2,-G);de=Math.floor(Le.width*vt),te=Math.floor(Le.height*vt),x.isDataArrayTexture?ve=Le.depth:x.isData3DTexture?ve=Math.floor(Le.depth*vt):ve=1,xe=0,Pe=0,ke=0}N!==null?(Fe=N.x,Je=N.y,Ce=N.z):(Fe=0,Je=0,Ce=0);const De=jt.convert(I.format),at=jt.convert(I.type);let pe;I.isData3DTexture?($.setTexture3D(I,0),pe=C.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?($.setTexture2DArray(I,0),pe=C.TEXTURE_2D_ARRAY):($.setTexture2D(I,0),pe=C.TEXTURE_2D),J.activeTexture(C.TEXTURE0),J.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,I.flipY),J.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),J.pixelStorei(C.UNPACK_ALIGNMENT,I.unpackAlignment);const It=J.getParameter(C.UNPACK_ROW_LENGTH),nt=J.getParameter(C.UNPACK_IMAGE_HEIGHT),Ot=J.getParameter(C.UNPACK_SKIP_PIXELS),qt=J.getParameter(C.UNPACK_SKIP_ROWS),pn=J.getParameter(C.UNPACK_SKIP_IMAGES);J.pixelStorei(C.UNPACK_ROW_LENGTH,Le.width),J.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Le.height),J.pixelStorei(C.UNPACK_SKIP_PIXELS,xe),J.pixelStorei(C.UNPACK_SKIP_ROWS,Pe),J.pixelStorei(C.UNPACK_SKIP_IMAGES,ke);const On=x.isDataArrayTexture||x.isData3DTexture,ut=I.isDataArrayTexture||I.isData3DTexture;if(x.isDepthTexture){const vt=L.get(x),mn=L.get(I),ft=L.get(vt.__renderTarget),gn=L.get(mn.__renderTarget);J.bindFramebuffer(C.READ_FRAMEBUFFER,ft.__webglFramebuffer),J.bindFramebuffer(C.DRAW_FRAMEBUFFER,gn.__webglFramebuffer);for(let Bn=0;Bn<ve;Bn++)On&&(C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,L.get(x).__webglTexture,G,ke+Bn),C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,L.get(I).__webglTexture,oe,Ce+Bn)),C.blitFramebuffer(xe,Pe,de,te,Fe,Je,de,te,C.DEPTH_BUFFER_BIT,C.NEAREST);J.bindFramebuffer(C.READ_FRAMEBUFFER,null),J.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else if(G!==0||x.isRenderTargetTexture||L.has(x)){const vt=L.get(x),mn=L.get(I);J.bindFramebuffer(C.READ_FRAMEBUFFER,W),J.bindFramebuffer(C.DRAW_FRAMEBUFFER,V);for(let ft=0;ft<ve;ft++)On?C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,vt.__webglTexture,G,ke+ft):C.framebufferTexture2D(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,vt.__webglTexture,G),ut?C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,mn.__webglTexture,oe,Ce+ft):C.framebufferTexture2D(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,mn.__webglTexture,oe),G!==0?C.blitFramebuffer(xe,Pe,de,te,Fe,Je,de,te,C.COLOR_BUFFER_BIT,C.NEAREST):ut?C.copyTexSubImage3D(pe,oe,Fe,Je,Ce+ft,xe,Pe,de,te):C.copyTexSubImage2D(pe,oe,Fe,Je,xe,Pe,de,te);J.bindFramebuffer(C.READ_FRAMEBUFFER,null),J.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else ut?x.isDataTexture||x.isData3DTexture?C.texSubImage3D(pe,oe,Fe,Je,Ce,de,te,ve,De,at,Le.data):I.isCompressedArrayTexture?C.compressedTexSubImage3D(pe,oe,Fe,Je,Ce,de,te,ve,De,Le.data):C.texSubImage3D(pe,oe,Fe,Je,Ce,de,te,ve,De,at,Le):x.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,oe,Fe,Je,de,te,De,at,Le.data):x.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,oe,Fe,Je,Le.width,Le.height,De,Le.data):C.texSubImage2D(C.TEXTURE_2D,oe,Fe,Je,de,te,De,at,Le);J.pixelStorei(C.UNPACK_ROW_LENGTH,It),J.pixelStorei(C.UNPACK_IMAGE_HEIGHT,nt),J.pixelStorei(C.UNPACK_SKIP_PIXELS,Ot),J.pixelStorei(C.UNPACK_SKIP_ROWS,qt),J.pixelStorei(C.UNPACK_SKIP_IMAGES,pn),oe===0&&I.generateMipmaps&&C.generateMipmap(pe),J.unbindTexture()},this.initRenderTarget=function(x){L.get(x).__webglFramebuffer===void 0&&$.setupRenderTarget(x)},this.initTexture=function(x){x.isCubeTexture?$.setTextureCube(x,0):x.isData3DTexture?$.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?$.setTexture2DArray(x,0):$.setTexture2D(x,0),J.unbindTexture()},this.resetState=function(){H=0,z=0,Q=null,J.reset(),dn.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return 2e3}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=et._getDrawingBufferColorSpace(e),t.unpackColorSpace=et._getUnpackColorSpace()}}
return window.LuliyThree={Scene:ym,Group:Oi,PerspectiveCamera:Vt,Mesh:Dt,MeshStandardMaterial:xc,MeshPhysicalMaterial:wm,MeshBasicMaterial:ii,DirectionalLight:Fm,AmbientLight:Nm,PointLight:Im,BoxGeometry:Ii,CylinderGeometry:no,PlaneGeometry:vr,CircleGeometry:to,TorusGeometry:xo,SphereGeometry:vo,CanvasTexture:Rm,Vector3:D,Color:Ye,WebGLRenderer:Hm,ShadowMaterial:Cm,DoubleSide:2,RepeatWrapping:1000,EquirectangularReflectionMapping:303,SRGBColorSpace:"srgb",ACESFilmicToneMapping:4,PCFSoftShadowMap:2};};

/* Locally rendered walnut, lacquer and brass turntable. No remote model or textures. */
(function(){
  'use strict';
  const radians=Math.PI/180;
  function create(host,options={}){
    let renderer;
    try{
      const T=window.LuliyThree||window.LuliyLoadThree();
      renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
      return mount(T,renderer,host,options);
    }catch(error){
      renderer?.dispose();renderer?.domElement.remove();
      host.classList.remove('lr-webgl-ready');
      return null;
    }
  }
  function createEmbedded(T,options={}){
    if(!T||!options.renderer||!options.camera||!options.host)throw new Error('Embedded turntable needs Three, renderer, camera and host');
    return mount(T,options.renderer,options.host,{...options,embedded:true});
  }
  function mount(T,renderer,host,{onPlay,onSeek,onSeekStart,onSeekEnd,onClamp,onFocus,onVolume,getVolume,onChange,rest,liftArmOnPause=false,parkGlassTransparent=false,embedded=false,camera:externalCamera,parkPosition=[4,-.887,1.7]}){
    const canvas=renderer.domElement;
    if(!embedded){
    canvas.className='lr-model-canvas';canvas.setAttribute('aria-hidden','true');host.prepend(canvas);
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
    renderer.setClearColor(0x000000,0);
    renderer.outputColorSpace=T.SRGBColorSpace;
    renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
    }
    const scene=new T.Scene(),camera=externalCamera||new T.PerspectiveCamera(34,1,.1,100),model=new T.Group();
    scene.add(model);
    const geometries=new Map(),materials=new Set(),textures=new Set();
    const listeners=[],reduce=matchMedia('(prefers-reduced-motion: reduce)');
    let disposed=false,contextLost=false,visible=true,raf=0,lastTime=0,width=1,height=1,settling=1;
    let clampOff=false,clampMotion=0,resting=false;
    let playing=false,ejected=false,discSpeed=0,armAngle=-.06,armLift=0,theme='dark',labelKey='';
    let weightStartYaw=.18,bleedLeft=0;
    let exchange=null,exchangeId=0,pendingTitle='',pendingNumber=1,pendingCover='',stageWidth=1,stageHeight=1;
    let playbackPosition=0,playbackDuration=0,armEngaged=false,labelSource='';
    const coverCache=new Map();
    let immersive=false,inlineBlend=1;const defaultRest=rest;
    const view={rx:48,rz:-12,zoom:1,tx:0,ty:.12,tz:0},targetView={...view};
    const listen=(el,type,fn,opts)=>{el.addEventListener(type,fn,opts);listeners.push(()=>el.removeEventListener(type,fn,opts));};
    function texture(c){const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());textures.add(t);return t;}
    function paint(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);return c;}
    let seed=61;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    const walnut=texture(paint(1024,256,(c,w,h)=>{
      const data=c.createImageData(w,h);
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        const bend=22*Math.sin(x*.004)+13*Math.sin(x*.015+y*.011)+4*Math.sin(x*.034),grain=y+bend;
        const rings=Math.sin(grain*.23+Math.sin(grain*.08+x*.002)*2),fine=Math.sin(grain*2.1+x*.006),pore=Math.pow(Math.max(0,Math.sin(grain*.89)),18);
        const v=rings*13+fine*4-pore*20+(random()-.5)*24,i=(y*w+x)*4;
        data.data[i]=Math.max(0,86+v*1.1);data.data[i+1]=Math.max(0,42+v*.65);data.data[i+2]=Math.max(0,23+v*.4);data.data[i+3]=255;
      }
      c.putImageData(data,0,0);
      for(let i=0;i<110;i++){c.strokeStyle=`rgba(20,8,3,${.06+random()*.12})`;c.lineWidth=.3+random();const y=random()*h;c.beginPath();c.moveTo(0,y);c.bezierCurveTo(w*.35,y-8,w*.6,y+10,w,y+random()*4);c.stroke();}
    }));
    const studio=texture(paint(1024,512,(c,w,h)=>{
      c.fillStyle='#0b0b0d';c.fillRect(0,0,w,h);
      const panel=(x,y,pw,ph,color)=>{const g=c.createLinearGradient(x,0,x+pw,0);g.addColorStop(0,'#151413');g.addColorStop(.14,color);g.addColorStop(.55,color);g.addColorStop(1,'#151413');c.fillStyle=g;c.fillRect(x,y,pw,ph);};
      panel(25,75,220,355,'#fff7e8');panel(585,80,160,335,'#e6e9ec');
    }));studio.mapping=T.EquirectangularReflectionMapping;scene.environment=studio;scene.environmentIntensity=1.65;
    function material(params){const m=new T.MeshPhysicalMaterial(embedded?{envMap:studio,envMapIntensity:1.65,...params}:params);materials.add(m);return m;}
    const wood=material({map:walnut,bumpMap:walnut,bumpScale:.014,roughness:.43,metalness:0,clearcoat:.1,clearcoatRoughness:.38});
    const black=material({color:0x050607,roughness:.16,metalness:.72,clearcoat:.8,clearcoatRoughness:.16});
    const rubber=material({color:0x070809,roughness:.82,metalness:.05});
    const brass=material({color:0xd8b879,metalness:1,roughness:.18});
    const brightBrass=material({color:0xead1a0,metalness:1,roughness:.12});
    const brushed=material({color:0xb18a4c,metalness:1,roughness:.34});
    const steel=material({color:0x969ba1,metalness:1,roughness:.25});
    const armBlack=material({color:0x15191b,metalness:.82,roughness:.24,clearcoat:.5});
    function geo(kind,args){const key=kind+args.join(',');if(!geometries.has(key))geometries.set(key,new T[kind](...args));return geometries.get(key);}
    function mesh(g,m,pos,parent=model){const o=new T.Mesh(g,m);o.position.set(...pos);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
    const box=(x,y,z,m,pos,parent)=>mesh(geo('BoxGeometry',[x,y,z]),m,pos,parent);
    const cylinder=(r,h,m,pos,parent=model,segments=64)=>mesh(geo('CylinderGeometry',[r,r,h,segments]),m,pos,parent);
    const ring=(r,tube,m,pos,parent=model)=>{const o=mesh(geo('TorusGeometry',[r,tube,10,96]),m,pos,parent);o.rotation.x=-Math.PI/2;return o;};
    function rod(a,b,r,m,parent=model){const start=new T.Vector3(...a),end=new T.Vector3(...b),delta=end.clone().sub(start);const o=cylinder(r,delta.length(),m,start.clone().add(end).multiplyScalar(.5).toArray(),parent,20);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return o;}
    function faceText(text,sub,w,h,color='#d8bf91'){
      return texture(paint(w,h,(c)=>{c.fillStyle=color;c.textAlign='center';c.font='28px Georgia';c.fillText(text,w/2,h*.43);c.font='10px Georgia';c.fillText(sub,w/2,h*.72);}));
    }
    // Solid wood case, recessed piano-black deck and a fine brass reveal.
    box(6.65,.68,4.72,wood,[0,-.105,0]);
    box(6.58,.06,4.65,wood,[0,.265,0]);
    box(6.58,.05,4.65,wood,[0,-.47,0]);
    box(6.35,.045,4.43,brightBrass,[0,.312,0]);
    box(6.29,.04,4.37,black,[0,.35,0]);
    box(6.38,.055,4.44,rubber,[0,-.51,0]);
    for(const x of [-2.75,2.75])for(const z of [-1.82,1.82]){
      cylinder(.31,.10,black,[x,-.56,z]);cylinder(.28,.23,brass,[x,-.7,z]);
      ring(.279,.014,brightBrass,[x,-.595,z]);cylinder(.295,.075,rubber,[x,-.845,z]);
    }
    const badgeMap=faceText('L U L I Y','REFERENCE  /  DIRECT DRIVE',512,100);
    const badgeMaterial=new T.MeshBasicMaterial({map:badgeMap,transparent:true,depthWrite:false});materials.add(badgeMaterial);
    const badge=mesh(geo('PlaneGeometry',[1.48,.29]),badgeMaterial,[1.89,.375,1.79]);badge.rotation.x=-Math.PI/2;badge.castShadow=false;
    // A machined platter with a substantial reflective rim.
    const center=[-.79,0,-.1];
    cylinder(1.99,.07,rubber,[center[0],.405,center[2]],model,128);
    cylinder(1.975,.265,brass,[center[0],.555,center[2]],model,128);
    ring(1.972,.013,brightBrass,[center[0],.431,center[2]]);
    cylinder(1.982,.022,brightBrass,[center[0],.687,center[2]],model,128);
    ring(1.96,.011,brushed,[center[0],.702,center[2]]);
    const disc=new T.Group();disc.name='vinyl';disc.position.set(center[0],.714,center[2]);model.add(disc);
    const discBodyMaterial=material({color:0x070809,roughness:.82,metalness:.05});
    cylinder(1.935,.026,discBodyMaterial,[0,0,0],disc,128);
    const grooveCanvas=paint(1024,1024,(c,w,h)=>{
      c.fillStyle='#111213';c.fillRect(0,0,w,h);
      for(let r=166;r<510;r+=3.6){const band=Math.sin(r*.028)*.5+.5,v=30+band*12+random()*10;c.strokeStyle=`rgb(${v},${v+1},${v+2})`;c.lineWidth=1.1+random()*.5;c.beginPath();c.arc(w/2,h/2,r,0,Math.PI*2);c.stroke();}
      for(const r of [190,247,320,397,471]){c.strokeStyle='#08090a';c.lineWidth=2;c.beginPath();c.arc(w/2,h/2,r,0,Math.PI*2);c.stroke();}
    });
    const grooveMap=texture(grooveCanvas);
    const grainDirection=texture(paint(512,512,(c,w,h)=>{
      const data=c.createImageData(w,h);
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        const a=Math.atan2(y-h/2,x-w/2)+Math.PI/2,i=(y*w+x)*4;
        data.data[i]=127.5+127.5*Math.cos(a);data.data[i+1]=127.5+127.5*Math.sin(a);data.data[i+2]=255;data.data[i+3]=255;
      }
      c.putImageData(data,0,0);
    }));grainDirection.colorSpace='';
    const vinylMaterial=material({map:grooveMap,bumpMap:grooveMap,bumpScale:.035,color:0x282828,metalness:.08,roughness:.56,anisotropy:.28,anisotropyMap:grainDirection,clearcoat:.025,clearcoatRoughness:.48});
    // Keep fine circular cuts readable at small sizes without additional meshes.
    vinylMaterial.onBeforeCompile=shader=>{
      shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
        float cutRadius = length(vMapUv - vec2(0.5));
        float cutPhase = cutRadius * 172.0;
        float cutAA = max(fwidth(cutPhase), 0.05);
        float cutRidge = 1.0 - smoothstep(0.16 - cutAA * 0.45, 0.16 + cutAA * 0.45, abs(fract(cutPhase) - 0.5));
        outgoingLight *= mix(0.68, 1.03, cutRidge);
        #include <opaque_fragment>
      `);
    };
    const grooveDisc=mesh(geo('CircleGeometry',[1.933,128]),vinylMaterial,[0,.015,0],disc);grooveDisc.rotation.x=-Math.PI/2;
    const labelCanvas=paint(1024,1024,()=>{}),labelMap=texture(labelCanvas);
    const labelMaterial=material({map:labelMap,roughness:.7,metalness:0});
    const label=mesh(geo('CircleGeometry',[.635,96]),labelMaterial,[0,.017,0],disc);label.name='record-label';label.rotation.x=-Math.PI/2;
    function paintLabel(image){
      const c=labelCanvas.getContext('2d'),size=labelCanvas.width;c.clearRect(0,0,size,size);
      // The artwork changes inside the existing circular geometry only.
      c.fillStyle='#172126';c.fillRect(0,0,size,size);
      if(image){
        const crop=Math.min(image.naturalWidth||image.width,image.naturalHeight||image.height);
        c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
        c.drawImage(image,((image.naturalWidth||image.width)-crop)/2,((image.naturalHeight||image.height)-crop)/2,crop,crop,0,0,size,size);
      }
      labelMap.needsUpdate=true;settling=2;request();
    }
    function primeCover(source){
      if(!source||coverCache.has(source))return;
      const image=new Image(),entry={image,ready:false};coverCache.set(source,entry);
      image.crossOrigin='anonymous';image.decoding='async';
      image.onload=()=>{
        if(disposed)return;entry.ready=true;
        if(labelSource===source)paintLabel(image);
      };
      image.onerror=()=>{if(!disposed&&labelSource===source)paintLabel(null);};
      image.src=source;
    }
    function updateLabel(title,number,cover=''){
      const key=title+'|'+number+'|'+cover;if(key===labelKey)return;labelKey=key;labelSource=cover;
      primeCover(cover);const entry=coverCache.get(cover);paintLabel(entry?.ready?entry.image:null);
    }
    updateLabel('Listening room',1);
    cylinder(.085,.025,brass,[center[0],.751,center[2]],model,32);
    cylinder(.033,.18,brightBrass,[center[0],.845,center[2]],model,24);
    const tip=mesh(geo('SphereGeometry',[.032,16,8]),brightBrass,[center[0],.939,center[2]]);
    // A clear optical-glass clamp: the same silhouette, with physical
    // transmission and softly refracted artwork visible beneath its facets.
    const weight=new T.Group();weight.name='spindle-weight';model.add(weight);
    const weightHome=new T.Vector3(center[0],.735,center[2]);weight.position.copy(weightHome);
    const glassProperties={color:0xf1f7fa,metalness:0,roughness:parkGlassTransparent?.42:.13,transmission:parkGlassTransparent?.92:.98,thickness:.34,ior:1.46,attenuationColor:0xdbeef2,attenuationDistance:7,clearcoat:.8,clearcoatRoughness:parkGlassTransparent?.28:.045,envMapIntensity:.45,flatShading:true,transparent:parkGlassTransparent};
    const facet=material(glassProperties),softFacet=material({...glassProperties,roughness:parkGlassTransparent?.48:.16,thickness:.39});
    const glassBase=material({...glassProperties,roughness:parkGlassTransparent?.34:.1,thickness:.08});
    const weightBase=box(.78,.085,.78,glassBase,[0,.0425,0],weight);weightBase.castShadow=false;
    const shoulder=box(.72,.02,.72,glassBase,[0,.095,0],weight);shoulder.castShadow=false;
    const pyramidGeometry=geo('CylinderGeometry',[0,.51,.88,4,1,false]);
    const sides=pyramidGeometry.groups[0],perFacet=sides.count/4;
    const caps=pyramidGeometry.groups.filter(g=>g.materialIndex>0).map(g=>({...g}));pyramidGeometry.clearGroups();
    for(let i=0;i<4;i++)pyramidGeometry.addGroup(sides.start+i*perFacet,perFacet,i);
    caps.forEach(g=>pyramidGeometry.addGroup(g.start,g.count,4));
    const facets=[facet,softFacet,facet,softFacet,glassBase];
    const pyramid=mesh(pyramidGeometry,facets,[0,.54,0],weight);
    pyramid.name='glass-pyramid';pyramid.castShadow=false;pyramid.rotation.y=Math.PI/4;weight.rotation.y=.18;
    const weightStart=weightHome.clone(),discHome=disc.position.clone(),discStart=disc.position.clone();
    let incomingOrigin=null,outgoingOrigin=null;const weightPark=new T.Vector3(),outPoint=new T.Vector3(),inPoint=new T.Vector3(),controlPoint=new T.Vector3();
    const parkedView=camera.quaternion.clone(),parkedRotation=camera.quaternion.clone(),seatedRotation=camera.quaternion.clone(),verticalAxis=new T.Vector3(0,1,0),parkTop=new T.Vector3(),parkBottom=new T.Vector3();let parkedViewReady=false;
    const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*t*(t*(t*6-15)+10);};
    const phase=(p,a,b)=>ease((p-a)/(b-a));
    function arc(object,from,to,t,lift){object.position.copy(from).lerp(to,t);object.position.y+=Math.sin(t*Math.PI)*lift;}
    function discOpacity(alpha){
      disc.visible=alpha>.001;
      for(const m of [discBodyMaterial,vinylMaterial,labelMaterial]){
        // A seated disc belongs to the opaque transmission buffer so the
        // glass can refract its cover, rather than the empty deck below it.
        const transparent=alpha<.999;if(m.transparent!==transparent){m.transparent=transparent;m.needsUpdate=true;}
        m.opacity=alpha;m.depthWrite=alpha>.95;
      }
    }
    // Front-left speed control, small index marks and warm operating light.
    cylinder(.27,.037,rubber,[-2.72,.387,1.66]);cylinder(.24,.103,brass,[-2.72,.46,1.66]);
    cylinder(.224,.02,brightBrass,[-2.72,.518,1.66]);
    const volumeMarker=box(.012,.003,.078,black,[-2.72,.53,1.52]);
    let knobVolume=-1;
    function setVolume(value){const volume=Math.max(0,Math.min(1,Number(value)||0));if(volume===knobVolume)return;knobVolume=volume;const angle=(volume-.5)*Math.PI*1.5;volumeMarker.position.set(-2.72+Math.sin(angle)*.14,.53,1.66-Math.cos(angle)*.14);volumeMarker.rotation.y=-angle;settling=2;request();}
    for(let i=0;i<7;i++){const a=(-60+i*20)*radians;const mark=box(.014,.006,.04,brushed,[-2.72+Math.sin(a)*.345,.375,1.66-Math.cos(a)*.345]);mark.rotation.y=-a;}
    const ledMaterial=new T.MeshBasicMaterial({color:0x756142});materials.add(ledMaterial);
    const led=mesh(geo('CircleGeometry',[.024,16]),ledMaterial,[-2.23,.374,1.87]);led.rotation.x=-Math.PI/2;led.castShadow=false;
    // Arm bearing, gimbal, counterweight and a separate moving carbon arm.
    const px=2.22,pz=-1.25;
    cylinder(.49,.06,rubber,[px,.395,pz]);cylinder(.465,.095,brass,[px,.47,pz]);
    ring(.453,.013,brightBrass,[px,.518,pz]);cylinder(.28,.36,armBlack,[px,.71,pz]);
    cylinder(.285,.04,brass,[px,.56,pz]);cylinder(.3,.06,brass,[px,.88,pz]);
    const bearing=cylinder(.23,.25,brass,[px,1.075,pz]);bearing.rotation.x=Math.PI/2;
    const gimbal=mesh(geo('TorusGeometry',[.256,.061,12,48]),armBlack,[px,1.075,pz]);
    cylinder(.065,.44,brightBrass,[px,1.13,pz]);cylinder(.2,.065,brass,[px,1.376,pz]);
    cylinder(.163,.072,armBlack,[px,1.442,pz]);ring(.163,.008,brightBrass,[px,1.48,pz]);
    for(let i=0;i<30;i++){const a=i*Math.PI*2/30;const tooth=box(.013,.046,.013,brushed,[px+Math.cos(a)*.168,1.443,pz+Math.sin(a)*.168]);tooth.rotation.y=-a;}
    const arm=new T.Group();arm.name='tonearm';arm.position.set(px,.945,pz);arm.rotation.y=armAngle;model.add(arm);
    rod([0,.13,-.69],[0,.13,2.78],.048,armBlack,arm);
    rod([0,.13,-.78],[0,.13,-.41],.257,brass,arm);
    rod([0,.13,-.8],[0,.13,-.775],.267,brightBrass,arm);
    rod([0,.13,-.43],[0,.13,-.405],.267,brightBrass,arm);
    rod([0,.13,2.6],[0,.13,2.76],.064,brass,arm);
    const head=box(.255,.055,.48,armBlack,[0,.123,2.96],arm);
    box(.174,.18,.21,brushed,[0,-.003,3.052],arm);
    box(.142,.14,.185,black,[0,-.027,3.064],arm);
    for(const x of [-.078,.078]){cylinder(.023,.02,brightBrass,[x,.162,2.86],arm,16);box(.029,.004,.005,black,[x,.174,2.86],arm);}
    const stylus=rod([-.04,-.077,3.1],[-.04,-.19,3.13],.009,steel,arm);stylus.name='stylus';
    const pivotRadius=Math.hypot(px-center[0],pz-center[2]),stylusRadius=Math.hypot(-.04,3.13);
    const closestArmAngle=Math.atan2(center[0]-px,center[2]-pz)-Math.atan2(-.04,3.13);
    function angleForProgress(progress){
      const radius=1.84-(1.84-.66)*progress;
      return closestArmAngle+Math.acos(Math.max(-1,Math.min(1,(pivotRadius* pivotRadius+stylusRadius*stylusRadius-radius*radius)/(2*pivotRadius*stylusRadius))));
    }
    function trackingAngle(){return angleForProgress(playbackDuration>0?Math.max(0,Math.min(1,playbackPosition/playbackDuration)):0);}
    rod([.11,.11,2.97],[.26,.065,3.14],.016,brass,arm);
    for(const [x,color] of [[-.063,0x823329],[.063,0x386860]]){const wire=material({color,roughness:.5});rod([x,.088,2.7],[x,-.009,2.92],.008,wire,arm);}
    // Cue lever and the arm rest are independent of the moving arm.
    cylinder(.053,.38,brass,[2.41,.58,.93],model,20);
    box(.25,.06,.12,black,[2.41,.79,.93]);
    rod([px+.23,.84,pz+.14],[px+.55,.72,pz+.45],.017,brass);
    rod([px+.53,.72,pz+.43],[px+.66,.72,pz+.53],.038,armBlack);
    // Soft studio lighting and contact shadows. No animated light or render loop while idle.
    const roomAmbient=new T.AmbientLight(0xfff4de,.4);scene.add(roomAmbient);
    const key=new T.DirectionalLight(0xfff2db,2.5);key.position.set(-3,7,5);key.castShadow=true;
    key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=5;key.shadow.camera.bottom=-5;key.shadow.camera.near=.5;key.shadow.camera.far=20;key.shadow.normalBias=.025;key.shadow.bias=-.0002;key.shadow.radius=3;scene.add(key);
    const rim=new T.DirectionalLight(0xffe1ae,1.6);rim.position.set(5,4,-4);scene.add(rim);
    const fill=new T.DirectionalLight(0xc5d3e5,.55);fill.position.set(-5,2,-1);scene.add(fill);
    const shadowMaterial=new T.ShadowMaterial({opacity:.34});materials.add(shadowMaterial);
    const ground=mesh(geo('PlaneGeometry',[18,18]),shadowMaterial,[0,-.887,0],scene);ground.rotation.x=-Math.PI/2;ground.castShadow=false;
    const target=new T.Vector3(0,.12,0),direction=new T.Vector3(),right=new T.Vector3(),up=new T.Vector3(),corner=new T.Vector3();
    const bounds=[];
    for(const x of [-3.33,3.33])for(const y of [-.5,.38])for(const z of [-2.36,2.36])bounds.push([x,y,z]);
    for(const x of [-3.05,3.05])for(const z of [-2.12,2.12])bounds.push([x,-.89,z]);
    for(const x of [1.7,2.8])for(const z of [-2.1,-.72])bounds.push([x,1.51,z]);
    for(const x of [-2.78,1.2])for(const z of [-2.09,1.89])bounds.push([x,.72,z]);
    bounds.push([center[0],1.74,center[2]]);
    function frameCamera(){
      const elevation=(78-view.rx)*radians,azimuth=(30+(view.rz+12))*radians;
      direction.set(Math.sin(azimuth)*Math.cos(elevation),Math.sin(elevation),Math.cos(azimuth)*Math.cos(elevation));
      right.set(Math.cos(azimuth),0,-Math.sin(azimuth));up.crossVectors(direction,right);camera.up.copy(up);
      target.set(view.tx,view.ty,view.tz);ground.visible=direction.y>.05;
      const tangent=Math.tan(camera.fov*radians/2);let distance=0,safeDistance=0;
      const horizontalLeft=stageWidth/2+bleedLeft-12,horizontalRight=stageWidth/2+20;
      const verticalTop=stageHeight*.44+64,verticalBottom=host.clientHeight-76+Math.max(0,(view.zoom-1)*340)-stageHeight*.44;
      for(const [x,y,z] of bounds){
        corner.set(x,y,z).sub(target);const depth=corner.dot(direction);
        const h=corner.dot(right),v=corner.dot(up);
        safeDistance=Math.max(safeDistance,depth+Math.abs(h)*stageHeight/(2*tangent*(h<0?horizontalLeft:horizontalRight)),depth+Math.abs(v)*stageHeight/(2*tangent*(v<0?verticalBottom:verticalTop)));
        distance=Math.max(distance,depth+Math.abs(corner.dot(right))/(tangent*camera.aspect*.94),depth+Math.abs(corner.dot(up))/(tangent*.92));
      }
      const framingZoom=host.closest(".lr-home")&&!immersive?.82:stageWidth<500?.72+Math.max(0,Math.min(1,(view.zoom-.7)/.65))*.26:.85+Math.max(0,Math.min(1,(view.zoom-.7)/.65))*.65;
      const inlineDistance=Math.max(distance/framingZoom,safeDistance),worldDistance=distance/view.zoom;
      camera.position.copy(target).addScaledVector(direction,worldDistance+(inlineDistance-worldDistance)*inlineBlend);camera.lookAt(target);camera.updateMatrixWorld();
    }
    function request(){if(embedded){if(!disposed)onChange?.();return;}if(!disposed&&!contextLost&&!raf&&visible&&!document.hidden)raf=requestAnimationFrame(draw);}
    const screenDepth=new T.Vector3();
    function worldAtScreen(x,y,out,reference=weightHome,r=(window.LuliyLayoutRect?.(canvas)||canvas.getBoundingClientRect())){
      screenDepth.copy(reference);if(embedded)model.localToWorld(screenDepth);screenDepth.project(camera);
      out.set((x-r.left)/r.width*2-1,1-(y-r.top)/r.height*2,screenDepth.z).unproject(camera);
      return embedded?model.worldToLocal(out):out;
    }
    function placeExchange(now){
      // A seated record needs no page geometry. Avoid five layout reads
      // per playback frame; parking and exchange alone need screen coordinates.
      let area,canvasArea;
      if(exchange||ejected||clampOff||clampMotion>.001){
        area=host.getBoundingClientRect();canvasArea=(window.LuliyLayoutRect?.(canvas)||canvas.getBoundingClientRect());const tray=rest?.getBoundingClientRect();
        if(embedded)weightPark.set(...parkPosition);
        else worldAtScreen(tray?tray.left+Math.min(78,tray.width*.3):area.right+55,tray?tray.bottom-20:area.bottom-40,weightPark,weightHome,canvasArea);
      }
      if(!exchange){
        if(parkGlassTransparent)for(const m of [facet,softFacet,glassBase])m.opacity=1-.58*(ejected?1:ease(clampMotion));
        disc.position.copy(discHome);disc.rotation.x=0;disc.rotation.z=0;disc.scale.setScalar(1);discOpacity(ejected?0:1);
        if(ejected)weight.position.copy(weightPark);else arc(weight,weightHome,weightPark,ease(clampMotion),.8);weight.rotation.y=(ejected||clampMotion>.001)?.18:disc.rotation.y+.18;
        const nextPhase=ejected?'empty':'seated';if(host.dataset.exchangePhase!==nextPhase)host.dataset.exchangePhase=nextPhase;return;
      }
      if(embedded){outPoint.set(-5,2.9,-3);if(outgoingOrigin)outPoint.copy(disc.parent.worldToLocal(outgoingOrigin.clone()));inPoint.set(-4.2,3,-2.5);if(incomingOrigin)inPoint.copy(disc.parent.worldToLocal(incomingOrigin.clone()));}
      else{
        worldAtScreen(area.left+stageWidth*.08,area.top+stageHeight*.09,outPoint,discHome,canvasArea);
        worldAtScreen(area.left+stageWidth*.13,area.top+stageHeight*.03,inPoint,discHome,canvasArea);
      }
      const raw=Math.max(0,Math.min(1,(now-exchange.start)/exchange.duration));
      const p=exchange.kind==='eject'?raw*.56:raw;
      const remove=phase(p,.07,.28),depart=phase(p,outgoingOrigin?.37:.29,.54),arrive=phase(p,.56,.8),replace=phase(p,.82,.98);
      // The transparent canvas has no opaque scenery to refract at the parking spot.
      if(parkGlassTransparent)for(const m of [facet,softFacet,glassBase])m.opacity=1-.58*remove*(1-replace);
      arc(weight,weightStart,weightPark,remove,.8*Math.min(1,weightStart.distanceTo(weightPark)));
      if(p>=.82)arc(weight,weightPark,weightHome,replace,.82);
      weight.rotation.y=weightStartYaw+(.18-weightStartYaw)*remove+Math.sin(remove*Math.PI)*.2-Math.sin(replace*Math.PI)*.18;
      if(p<.56){
        if(outgoingOrigin){const raised=discStart.clone();raised.y+=.85;if(p<.37){disc.position.copy(discStart);disc.position.y+=.85*phase(p,.29,.37);}else arc(disc,raised,outPoint,depart,.65);}else arc(disc,discStart,outPoint,depart,1.05);
        disc.rotation.x=-.1*depart;disc.rotation.z=.13*depart;
        discOpacity(exchange.fromEmpty?0:outgoingOrigin?1-phase(p,.53,.56):1-phase(p,.39,.54));
      }else{
        updateLabel(pendingTitle,pendingNumber,pendingCover);
        arc(disc,inPoint,discHome,arrive,.52);
        disc.rotation.x=-.2*(1-arrive);disc.rotation.z=.16*(1-arrive);
        discOpacity(incomingOrigin?1:phase(p,.56,.64));
      }
      disc.scale.setScalar(outgoingOrigin&&p<.56?1-.81*depart:1);
      const nextPhase=p<.07?'arm-return':p<.28?'unclamp':p<.56?'eject':p<.8?'insert':p<.98?'clamp':'seated';if(host.dataset.exchangePhase!==nextPhase)host.dataset.exchangePhase=nextPhase;
      renderer.shadowMap.needsUpdate=true;
    }
    function lockParkedGlass(now){
      if(!parkGlassTransparent||embedded)return;
      if(!parkedViewReady){parkedView.copy(camera.quaternion).invert().multiply(seatedRotation.setFromAxisAngle(verticalAxis,.18));parkedViewReady=true;}
      const raw=exchange?Math.max(0,Math.min(1,(now-exchange.start)/exchange.duration)):0,p=exchange?.kind==='eject'?raw*.56:raw;
      const blend=exchange?phase(p,.07,.28)*(1-phase(p,.82,.98)):ejected?1:ease(clampMotion);
      seatedRotation.setFromAxisAngle(verticalAxis,weight.rotation.y);
      parkedRotation.copy(camera.quaternion).multiply(parkedView);
      weight.quaternion.copy(parkedRotation);weight.scale.setScalar(1);weight.updateWorldMatrix(true,false);
      parkBottom.set(0,0,0);weight.localToWorld(parkBottom).project(camera);
      parkTop.set(0,1,0);weight.localToWorld(parkTop).project(camera);
      const projectedHeight=Math.abs(parkTop.y-parkBottom.y)*height/2,parkedScale=(stageWidth<500?48:66)/Math.max(1,projectedHeight);
      weight.quaternion.copy(seatedRotation).slerp(parkedRotation,blend);weight.scale.setScalar(1+(parkedScale-1)*blend);
    }
    function draw(now){
      raf=0;if(disposed||contextLost||!visible||document.hidden)return;
      const dt=Math.min(.05,lastTime?(now-lastTime)/1000:.016);lastTime=now;
      const lerp=reduce.matches?1:1-Math.exp(-dt*15);
      let movement=0;for(const k of ['rx','rz','zoom','tx','ty','tz']){view[k]+=(targetView[k]-view[k])*(immersive&&!reduce.matches?1-Math.exp(-dt*7):lerp);movement+=Math.abs(targetView[k]-view[k]);}
      clampMotion+=((clampOff?1:0)-clampMotion)*(reduce.matches?1:1-Math.exp(-dt*7));
      const exchangeProgress=exchange?Math.max(0,Math.min(1,(now-exchange.start)/exchange.duration)):1;
      const seeking=control?.kind==='arm'&&control.moved;
      const pausedArm=liftArmOnPause&&!playing&&!exchange&&!seeking;
      const armDestination=ejected||resting||clampOff||pausedArm||exchange&&(exchange.kind==='eject'||exchangeProgress<.9)||!armEngaged&&!exchange?-.06:trackingAngle();
      // Lift before sweeping off the vinyl; returning to playback stays raised until aligned.
      const nextArm=pausedArm&&Math.abs(armAngle-armDestination)>.02&&armLift<.08?armAngle:armDestination;
      if(Math.abs(armAngle-nextArm)>.0005)renderer.shadowMap.needsUpdate=true;
      armAngle+=(nextArm-armAngle)*(reduce.matches?1:1-Math.exp(-dt*7));arm.rotation.y=armAngle;
      const targetLift=((seeking||resting||clampOff||pausedArm||liftArmOnPause&&!exchange&&Math.abs(armAngle-armDestination)>.03)? .13:0)+(exchange?phase((now-exchange.start)/exchange.duration,0,.06)*(1-phase((now-exchange.start)/exchange.duration,.9,1))*.13:0);
      if(Math.abs(armLift-targetLift)>.001)renderer.shadowMap.needsUpdate=true;
      armLift+=(targetLift-armLift)*(reduce.matches?1:1-Math.exp(-dt*14));arm.position.y=.945+armLift;
      discSpeed+=((playing&&!exchange&&!reduce.matches?1:0)-discSpeed)*(1-Math.exp(-dt*5));
      if(discSpeed>.0001)disc.rotation.y-=dt*(Math.PI*2/1.8)*.7*discSpeed;
      weight.rotation.y=disc.rotation.y+.18;
      ledMaterial.color.set(playing?0xf4c87e:0x756142);
      if(!embedded)frameCamera();placeExchange(now);lockParkedGlass(now);
      if(!embedded){renderer.render(scene,camera);host.classList.add('lr-webgl-ready');}
      settling--;
      const active=Math.abs(armLift-targetLift)>.001||Math.abs(clampMotion-(clampOff?1:0))>.001||exchange||(playing&&!reduce.matches)||movement>.001||Math.abs(armAngle-nextArm)>.0005||discSpeed>.001||settling>0;
      if(active)request();return !!active;
    }
    function resize(){
      if(disposed)return;stageWidth=host.clientWidth;stageHeight=Math.max(180,host.clientHeight-64*inlineBlend);if(!stageWidth)return;
      const layout=host.closest('.lr-standalone .lr-layout')||host.parentElement,area=host.getBoundingClientRect(),layoutArea=layout.getBoundingClientRect();
      const homeFrame=!!host.closest(".lr-home")&&!immersive;const padX=homeFrame?0:Math.min(120,Math.max(0,area.left-8))*inlineBlend,padTop=homeFrame?0:80*inlineBlend;bleedLeft=padX;
      const nativeWidth=homeFrame?stageWidth:Math.max(stageWidth,layoutArea.right-area.left+Math.min(120,Math.max(0,area.left-8))+24);
      const nativeHeight=homeFrame?host.clientHeight:Math.max(host.clientHeight,(rest?.getBoundingClientRect().bottom||area.bottom)-area.top)+224;
      const nextWidth=Math.ceil(stageWidth+(nativeWidth-stageWidth)*inlineBlend),nextHeight=Math.ceil(host.clientHeight+(nativeHeight-host.clientHeight)*inlineBlend);
      if(width!==nextWidth||height!==nextHeight){width=nextWidth;height=nextHeight;const ratio=window.LuliyQuality.ratio(renderer,1.5,2200000,width,height);if(Math.abs(renderer.getPixelRatio()-ratio)>.01)renderer.setPixelRatio(ratio);renderer.setSize(width,height,false);}canvas.style.width=width+'px';canvas.style.height=height+'px';
      canvas.style.left=-padX+'px';canvas.style.top=-padTop+'px';
      if(inlineBlend===0||homeFrame){camera.clearViewOffset();camera.aspect=width/height;}
      else camera.setViewOffset(stageWidth,stageHeight,-padX,-padTop+stageHeight*.06*inlineBlend,width,height);
      camera.updateProjectionMatrix();settling=2;request();
    }
    let resizeObserver=null,intersection=null;
    if(!embedded){
      resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);resizeObserver.observe(host.parentElement);if(rest)resizeObserver.observe(rest);
      intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting&&entry.intersectionRatio>.01;if(visible){lastTime=0;settling=2;request();}else{cancelAnimationFrame(raf);raf=0;}},{rootMargin:'0px',threshold:[0,.01]});intersection.observe(host);
      listen(document,'visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else{lastTime=0;settling=2;request();}});
      listen(reduce,'change',()=>{settling=2;request();});
    }
    function project(point){const p=point.clone().project(camera),r=(window.LuliyLayoutRect?.(canvas)||canvas.getBoundingClientRect());return {x:r.left+(p.x+1)*r.width/2,y:r.top+(1-p.y)*r.height/2};}
    let control=null;
    function localPointer(x,y){
      const r=(window.LuliyLayoutRect?.(canvas)||canvas.getBoundingClientRect()),origin=camera.getWorldPosition(new T.Vector3());
      const direction=new T.Vector3((x-r.left)/r.width*2-1,1-(y-r.top)/r.height*2,.5).unproject(camera).sub(origin).normalize();
      model.updateWorldMatrix(true,false);
      const normal=new T.Vector3(0,1,0).transformDirection(model.matrixWorld),planePoint=model.localToWorld(new T.Vector3(0,.945,0));
      const denominator=direction.dot(normal);if(Math.abs(denominator)<.00001)return null;
      const distance=planePoint.sub(origin).dot(normal)/denominator;if(distance<0)return null;
      return model.worldToLocal(origin.addScaledVector(direction,distance));
    }
    function hitControl(x,y){
      model.updateWorldMatrix(true,true);
      const normal=new T.Vector3(0,1,0).transformDirection(model.matrixWorld);
      if(camera.getWorldPosition(new T.Vector3()).sub(model.localToWorld(new T.Vector3(0,.945,0))).dot(normal)<0)return null;
      const clampPoint=project(weight.localToWorld(new T.Vector3(0,.45,0)));if(onClamp&&Math.hypot(x-clampPoint.x,y-clampPoint.y)<24)return 'clamp';
      const knob=project(model.localToWorld(new T.Vector3(-2.72,.53,1.66)));
      if(Math.hypot(x-knob.x,y-knob.y)<24)return 'volume';
      const a=project(arm.localToWorld(new T.Vector3(0,.13,0))),b=project(arm.localToWorld(new T.Vector3(0,.13,3.13)));
      const dx=b.x-a.x,dy=b.y-a.y,length=dx*dx+dy*dy;if(length<1)return null;
      const t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/length));
      return Math.hypot(x-a.x-t*dx,y-a.y-t*dy)<16?'arm':null;
    }
    function beginControl(e){
      if(control)return true;
      if(exchange||ejected||e.button!==0)return false;
      const kind=hitControl(e.clientX,e.clientY);if(!kind||kind==='arm'&&!playbackDuration)return false;
      const point=localPointer(e.clientX,e.clientY);if(kind==='arm'&&!point)return false;
      control={kind,id:e.pointerId,x:e.clientX,y:e.clientY,position:playbackPosition,volume:getVolume?.()??.45,angle:liftArmOnPause&&!playing?trackingAngle():armEngaged?armAngle:trackingAngle(),pointerAngle:point?Math.atan2(point.x-px,point.z-pz):0,moved:false};
      host.classList.add('lr-control-dragging');return true;
    }
    function moveControl(e){
      if(!control||control.id!==e.pointerId)return false;
      if(Math.hypot(e.clientX-control.x,e.clientY-control.y)<3&&!control.moved)return true;
      if(!control.moved&&control.kind==='arm'){onSeekStart?.();host.classList.add('lr-arm-seeking');}
      control.moved=true;
      if(control.kind==='volume')onVolume?.(Math.max(0,Math.min(1,control.volume+(e.clientX-control.x-(e.clientY-control.y))/180)));
      else if(control.kind==='arm'){
        const point=localPointer(e.clientX,e.clientY);if(!point)return true;
        const delta=Math.atan2(point.x-px,point.z-pz)-control.pointerAngle;
        const angle=Math.max(angleForProgress(1),Math.min(angleForProgress(0),control.angle+Math.atan2(Math.sin(delta),Math.cos(delta))));
        const x=px-.04*Math.cos(angle)+3.13*Math.sin(angle),z=pz+.04*Math.sin(angle)+3.13*Math.cos(angle);
        const radius=Math.hypot(x-center[0],z-center[2]),ratio=Math.max(0,Math.min(1,(1.84-radius)/(1.84-.66)));
        playbackPosition=ratio*playbackDuration;armEngaged=true;settling=2;request();onSeek?.(ratio,false);
      }
      return true;
    }
    function endControl(e){
      if(!control||control.id!==e.pointerId)return false;
      const finished=control;control=null;host.classList.remove('lr-control-dragging','lr-arm-seeking');
      if(finished.kind==='arm'){
        if(e.type==='pointercancel'){playbackPosition=finished.position;onSeek?.(playbackPosition/playbackDuration,false);}
        else if(finished.moved)onSeek?.(playbackPosition/playbackDuration,true);
        else if(onFocus)onFocus('arm');else onPlay?.();
        if(finished.moved)onSeekEnd?.();
      }
      if(finished.kind==='clamp'&&!finished.moved&&e.type!=='pointercancel')onClamp?.();
      if(finished.kind==='volume'&&!finished.moved&&e.type!=='pointercancel')onFocus?.('volume');
      settling=2;request();return true;
    }
    function wheelControl(e){if(exchange||hitControl(e.clientX,e.clientY)!=='volume'||e.ctrlKey)return false;onVolume?.(Math.max(0,Math.min(1,(getVolume?.()??.45)-e.deltaY*(e.deltaMode===1?16:1)*.001)));return true;}
    if(!embedded){
      listen(canvas,'webglcontextlost',e=>{e.preventDefault();contextLost=true;cancelAnimationFrame(raf);raf=0;host.classList.remove('lr-webgl-ready');canvas.hidden=true;});
      listen(canvas,'webglcontextrestored',()=>{if(disposed)return;contextLost=false;canvas.hidden=false;lastTime=0;renderer.shadowMap.needsUpdate=true;settling=2;resize();request();});
      resize();
    }
    function setTheme(next){if(next!==theme){theme=next;shadowMaterial.opacity=theme==='light'?.22:.34;roomAmbient.intensity=theme==='light'?.68:.4;key.intensity=theme==='light'?2.1:2.5;fill.intensity=theme==='light'?.82:.55;rim.intensity=theme==='light'?1.1:1.6;settling=2;request();}}
    return {
      object:model,environment:studio,update:draw,setIncomingOrigin(point){incomingOrigin=point?.clone()||null;},setOutgoingOrigin(point){outgoingOrigin=point?.clone()||null;},hitControl,beginControl,moveControl,endControl,wheelControl,setVolume,isSeeking:()=>control?.kind==='arm',
      setView(next){Object.assign(targetView,next);settling=2;request();},
      setPresentation(next){
        const nextImmersive=!!next.immersive,nextBlend=nextImmersive?Math.max(0,Math.min(1,Number(next.inlineBlend)||0)):1,nextRest=nextImmersive?next.rest:defaultRest;
        const changed=nextImmersive!==immersive||Math.abs(nextBlend-inlineBlend)>.0001||nextRest!==rest;
        immersive=nextImmersive;inlineBlend=nextBlend;rest=nextRest;if(changed){control=null;host.classList.remove('lr-control-dragging');resize();}
      },
      setTheme,
      setProgress(next,durationValue){
        if(typeof next==='number')next={position:next,duration:durationValue};
        if(control?.kind==='arm')return;
        const position=Math.max(0,Number(next.position)||0),duration=Math.max(0,Number(next.duration)||0);
        if(position===playbackPosition&&duration===playbackDuration)return;
        playbackPosition=position;playbackDuration=duration;
        if(!exchange&&!ejected&&position>0)armEngaged=true;
        settling=2;request();
      },
      setState(next){
        playing=!!next.playing;ejected=!!next.ejected;clampOff=!!next.clampOff;resting=!!next.resting;pendingTitle=next.title;pendingNumber=next.number;pendingCover=next.cover||'';primeCover(pendingCover);
        if(next.exchange&&next.exchange.id!==exchangeId){
          exchangeId=next.exchange.id;armEngaged=false;weightStart.copy(weight.position);discStart.copy(disc.position);weightStartYaw=.18+Math.atan2(Math.sin(weight.rotation.y-.18),Math.cos(weight.rotation.y-.18));
        }
        exchange=next.exchange||null;
        if(control?.kind!=='arm'&&Number.isFinite(next.position))playbackPosition=Math.max(0,next.position);
        if(Number.isFinite(next.duration))playbackDuration=Math.max(0,next.duration);
        if(ejected)armEngaged=false;
        else if(!exchange&&!resting&&!clampOff&&(playing||playbackPosition>0))armEngaged=true;
        if(!exchange&&!ejected)updateLabel(pendingTitle,pendingNumber,pendingCover);
        setTheme(next.theme);settling=2;request();
      },
      destroy(){if(disposed)return;disposed=true;control=null;host.classList.remove('lr-control-dragging');cancelAnimationFrame(raf);resizeObserver?.disconnect();intersection?.disconnect();listeners.forEach(off=>off());coverCache.forEach(({image})=>{image.onload=null;image.onerror=null;});coverCache.clear();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());model.removeFromParent();if(!embedded){renderer.dispose();renderer.forceContextLoss();canvas.remove();host.classList.remove('lr-webgl-ready');}}
    };
  }
  window.LuliyTurntable={create,createEmbedded};
})();

window.LuliyRecordMessages={
  "放入唱片": [
    "Place record",
    "レコードを置く"
  ],
  "背面资料": [
    "Sleeve notes",
    "ジャケット情報"
  ],
  "♡ 收藏": [
    "♡ Favorite",
    "♡ お気に入り"
  ],
  "♥ 已收藏": [
    "♥ Favorited",
    "♥ 登録済み"
  ],
  "关闭": [
    "Off",
    "オフ"
  ],
  "15 分钟": [
    "15 minutes",
    "15 分"
  ],
  "30 分钟": [
    "30 minutes",
    "30 分"
  ],
  "60 分钟": [
    "60 minutes",
    "60 分"
  ],
  "这首结束": [
    "End of song",
    "この曲の終わり"
  ],
  "黑胶底噪": [
    "Vinyl ambience",
    "レコードのノイズ"
  ],
  "唱针": [
    "Stylus",
    "針"
  ],
  "旋钮": [
    "Volume",
    "音量"
  ],
  "玻璃": [
    "Glass",
    "ガラス"
  ],
  "拿起玻璃": [
    "Lift glass",
    "ガラスを外す"
  ],
  "放回玻璃": [
    "Place glass",
    "ガラスを戻す"
  ],
  "全景": [
    "Overview",
    "全体"
  ],
  "拖入转盘": [
    "Drag to turntable",
    "ターンテーブルへ"
  ],
  "这首结束后停止": [
    "Stops at the end of this song",
    "この曲の終了時に停止"
  ],
  "写下这张唱片的故事。": [
    "Write your listening notes.",
    "このレコードの思い出を書きましょう。"
  ],
  "定时停止": [
    "Sleep timer",
    "スリープタイマー"
  ],
  "翻转唱片封套": [
    "Flip sleeve",
    "ジャケットを裏返す"
  ],
  "歌手": [
    "Artist",
    "アーティスト"
  ],
  "年份": [
    "Year",
    "年"
  ],
  "我的听歌笔记": [
    "My listening notes",
    "私のリスニングノート"
  ],
  "取消": [
    "Cancel",
    "キャンセル"
  ],
  "保存": [
    "Save",
    "保存"
  ],
  "播放顺序已更新。": [
    "Play order updated.",
    "再生順序を更新しました。"
  ],
  "当前浏览器无法启用底噪。": [
    "Vinyl ambience is unavailable in this browser.",
    "このブラウザーはノイズに対応していません。"
  ],
  "底噪暂时无法启用。": [
    "Vinyl ambience could not be enabled.",
    "ノイズを有効にできませんでした。"
  ],
  "浏览器未能保存，当前更改仅在本次访问有效。": [
    "Changes could not be saved; they remain for this visit.",
    "変更を保存できませんでした。今回の閲覧では有効です。"
  ]
};
/* Standalone additions; the homepage never attaches this interface. */
(function(){
'use strict';
let api,library={},instances=new Set(),timer=null,timerTick=0,audioContext=null,noiseGain=null,noiseEnabled=false;
const key='luliy-listening-library-v1',esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
try{library=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(e){}
library.favorites=Array.isArray(library.favorites)?library.favorites:[];library.notes=library.notes||{};library.order=Array.isArray(library.order)?library.order:[];
delete library.recent;delete library.lyrics;delete library.positions;
const glyphs={heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z',timer:'M12 8v5l3 2M9 2h6M18 4l2 2M21 13a9 9 0 1 1-18 0 9 9 0 0 1 18 0',noise:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18M12 11v2',arm:'M19 3v6L8 20l-4-4L16 7V3M3 21h7',knob:'M12 3v6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',glass:'M12 2 2 20h20L12 2zM12 2v18M2 20l10-6 10 6',lift:'M12 17V3M7 8l5-5 5 5M4 17v4h16v-4',flip:'M4 8h14l-4-4M18 8l-4 4M20 16H6l4 4M6 16l4-4',edit:'m15 4 5 5M4 20l4-1L21 6l-5-5L3 14z'};
const icon=n=>'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+glyphs[n]+'"/></svg>';
function tr(t){const v=window.LuliyRecordMessages?.[t];return v&&api?.state.lang!=='zh'?v[api.state.lang==='ja'?1:0]:t;}
function name(t){return t?.name?.[api.state.lang]||t?.name?.zh||'';}
function persist(){try{localStorage.setItem(key,JSON.stringify(library));}catch(e){instances.forEach(i=>i.message(tr('浏览器未能保存，当前更改仅在本次访问有效。')));}}
function order(){const indices=library.order.map(id=>api.tracks.findIndex(t=>t.id===id)).filter(i=>i>=0);return [...new Set([...indices,...api.tracks.map((_,i)=>i)])].filter(i=>!api.tracks[i].private&&!api.tracks[i].revoked);}
function update(){instances.forEach(i=>i.update());syncNoise();}
function clearTimer(){clearInterval(timerTick);timerTick=0;timer=null;update();}
function stopLater(value){clearInterval(timerTick);timer=value==='end'?{end:true}:Number(value)>0?{minutes:Number(value),until:Date.now()+Number(value)*60000}:null;if(timer?.until)timerTick=setInterval(()=>{if(Date.now()>=timer.until){clearTimer();api.softStop();}else update();},1000);update();}
function onEnded(){if(!timer?.end)return false;clearTimer();api.softStop();return true;}
async function enableNoise(){
 if(!audioContext){const A=window.AudioContext||window.webkitAudioContext;if(!A)return false;audioContext=new A();const buffer=audioContext.createBuffer(1,audioContext.sampleRate*3,audioContext.sampleRate),data=buffer.getChannelData(0);let last=0;for(let i=0;i<data.length;i++){last=(last+Math.random()*.04-.02)/1.025;data[i]=last+(Math.random()<.00007?(Math.random()-.5)*.2:0);}const source=audioContext.createBufferSource();source.buffer=buffer;source.loop=true;const filter=audioContext.createBiquadFilter();filter.type='lowpass';filter.frequency.value=2400;noiseGain=audioContext.createGain();noiseGain.gain.value=0;source.connect(filter).connect(noiseGain).connect(audioContext.destination);source.start();}
 await audioContext.resume();return true;
}
function syncNoise(){if(!noiseGain)return;const level=noiseEnabled&&instances.size&&api.state.playing&&!api.state.exchange&&!document.hidden?Math.min(api.state.volume*.025,.008):0;noiseGain.gain.setTargetAtTime(level,audioContext.currentTime,.2);}
function configure(value){api=value;document.addEventListener('visibilitychange',syncNoise);}
function attach(root,{on,focus,reset,clamp,album}){
 const meta=root.querySelector('.lr-meta'),scene=root.querySelector('.lr-scene'),shelf=root.querySelector('.lr-shelf'),heading=root.querySelector('.lr-shelf-heading'),cards=[...shelf.querySelectorAll('[data-lr-track]')];
 let lastIndex=-2,notificationTimer=0,editDialog=null,dragged=null,gesture=null,holdTimer=0,ghost=null,suppressUntil=0,lastWheel=0,disposed=false;
 const left=document.createElement('div');left.className='lr-console';left.append(scene);scene.append(root.querySelector('.lr-clamp-rest'));const gallery=document.createElement('div');gallery.className='lr-gallery';gallery.append(heading,shelf);const layout=root.querySelector('.lr-layout');layout.prepend(left);layout.append(gallery);
 const counter=meta.querySelector('.lr-counter'),top=document.createElement('div');top.className='lr-meta-top';counter.before(top);top.append(counter);
 const tools=document.createElement('div');tools.className='lr-listening-actions';tools.innerHTML='<button type="button" class="lr-icon-button" data-extra="favorite-current" aria-pressed="false">'+icon('heart')+'</button><label class="lr-sleep-label">'+icon('timer')+'<select class="lr-sleep" aria-label="定时停止"><option value="0">定时停止 · 关闭</option><option value="15">15 分钟</option><option value="30">30 分钟</option><option value="60">60 分钟</option><option value="end">这首结束</option></select></label><button type="button" class="lr-icon-button" data-extra="noise" aria-pressed="false">'+icon('noise')+'</button>';top.append(tools);
 const status=document.createElement('div');status.className='lr-listening-status';status.setAttribute('role','status');meta.querySelector('.lr-audio-status').after(status);
 const detail=document.createElement('span');detail.className='lr-detail-actions';for(const [action,label,glyph] of [['focus-arm','唱针','arm'],['focus-volume','旋钮','knob'],['focus-clamp','玻璃','glass'],['clamp','拿起玻璃','lift']])detail.innerHTML+='<button type="button" class="lr-icon-button" data-extra="'+action+'" aria-label="'+label+'" title="'+label+'">'+icon(glyph)+'</button>';scene.querySelector('.lr-view-controls').append(detail);
 const sleeveTools=document.createElement('span');sleeveTools.className='lr-sleeve-tools';sleeveTools.innerHTML='<button type="button" class="lr-icon-button" data-extra="flip" aria-label="翻转唱片封套" title="翻转唱片封套">'+icon('flip')+'</button><button type="button" class="lr-icon-button" data-extra="edit" aria-label="背面资料" title="背面资料">'+icon('edit')+'</button>';heading.querySelector('.lr-shelf-label').after(sleeveTools);
 shelf.classList.add('lr-arc-shelf');shelf.setAttribute('aria-roledescription','唱片轮播');
 const title=t=>{const info={...t,...library.notes[t.id]};return '<strong>'+esc(name(t))+'</strong><span>'+esc(info.artist||'')+'</span><span>'+esc(info.year||'')+'</span><span>'+esc(info.note||tr('写下这张唱片的故事。'))+'</span>';};
 cards.forEach(card=>{card.draggable=true;const back=document.createElement('span');back.className='lr-record-back';card.querySelector('.lr-cover').after(back);back.innerHTML=title(api.tracks[+card.dataset.lrTrack]);});
 const selectedIndex=()=>Math.max(0,api.state.index);
 function message(text){status.textContent=text;clearTimeout(notificationTimer);notificationTimer=setTimeout(()=>{notificationTimer=0;refreshStatus();},3500);}
 function refreshStatus(){if(notificationTimer)return;const minutes=timer?.until?Math.max(1,Math.ceil((timer.until-Date.now())/60000)):0;status.textContent=timer?.end?tr('这首结束后停止'):minutes?(api.state.lang==='zh'?'将在 '+minutes+' 分钟后停止':api.state.lang==='ja'?minutes+' 分後に停止':'Stops in '+minutes+' min'):'';}
 function syncPrivateCards(){for(const card of cards.filter(c=>c.dataset.privateRecord==='true')){if(!api.tracks[+card.dataset.lrTrack]?.private||api.tracks[+card.dataset.lrTrack]?.revoked){card.remove();cards.splice(cards.indexOf(card),1);lastIndex=-2;}}api.tracks.forEach((track,index)=>{if(!track.private||track.revoked)return;let card=cards.find(c=>+c.dataset.lrTrack===index);if(!card){card=document.createElement('button');card.type='button';card.className='lr-record';card.dataset.lrTrack=index;card.dataset.privateRecord='true';card.draggable=true;shelf.append(card);cards.push(card);lastIndex=-2;}const markup=window.LuliyRecords.mediaLibrary.cover(track.id)+'<span class="lr-record-back">'+title(track)+'</span><span class="lr-record-name">'+esc(name(track))+'</span><span class="lr-record-info">Drive / '+(Number(track.duration)>0?api.time(track.duration):'時長未知')+'</span><span class="lr-record-state" aria-hidden="true"></span>';if(card.innerHTML!==markup)card.innerHTML=markup;card.setAttribute('aria-label',name(track));card.setAttribute('aria-current',String(index===api.state.index));});}function arrange(){syncPrivateCards();const center=Math.max(0,cards.findIndex(c=>+c.dataset.lrTrack===selectedIndex())),n=cards.length;if(lastIndex===center)return;lastIndex=center;sleeveTools.querySelector('[data-extra="flip"]').setAttribute('aria-pressed','false');cards.forEach((card,i)=>{let offset=(i-center+n)%n;if(offset>n/2)offset-=n;const visible=Math.abs(offset)<=(window.LuliyMobilePhone?1:3);card.dataset.arcOffset=offset;card.dataset.arcVisible=String(visible);card.style.setProperty('--lr-arc',offset);card.style.setProperty('--lr-depth',Math.abs(offset));card.style.zIndex=String(10-Math.min(8,Math.abs(offset)));card.setAttribute('aria-hidden',String(!visible));card.inert=!visible;card.tabIndex=offset===0?0:-1;card.classList.remove('lr-record-flipped');});}
 function reorder(){return;const list=album.querySelector('ol');for(const index of order()){const row=list.querySelector('[data-lr-album-track="'+index+'"]')?.closest('li');if(!row)continue;row.draggable=true;row.dataset.orderTrack=index;list.append(row);}list.querySelectorAll('li').forEach((li,i)=>li.querySelector('small').textContent=String(i+1).padStart(2,'0'));}
 function update(){
  arrange();const id=api.current().id,favorite=tools.querySelector('[data-extra="favorite-current"]');favorite.setAttribute('aria-pressed',String(api.current().private?!!api.current().file?.favorite:library.favorites.includes(id)));sleeveTools.querySelectorAll('button').forEach(b=>b.disabled=!!api.current().private);favorite.setAttribute('aria-label',tr(library.favorites.includes(id)?'♥ 已收藏':'♡ 收藏'));favorite.title=favorite.getAttribute('aria-label');
  const noise=tools.querySelector('[data-extra="noise"]');noise.setAttribute('aria-pressed',String(noiseEnabled));noise.setAttribute('aria-label',tr('黑胶底噪'));noise.title=tr('黑胶底噪');
  const sleep=tools.querySelector('.lr-sleep');sleep.setAttribute('aria-label',tr('定时停止'));sleep.title=tr('定时停止');[...sleep.options].forEach((o,i)=>o.textContent=i===0?tr('定时停止')+' · '+tr('关闭'):tr(['','15 分钟','30 分钟','60 分钟','这首结束'][i]));sleep.value=timer?.end?'end':timer?.until?String(timer.minutes):'0';
  detail.querySelectorAll('button').forEach(b=>{const label=b.dataset.extra==='clamp'?(api.state.clampOff?'放回玻璃':'拿起玻璃'):({'focus-arm':'唱针','focus-volume':'旋钮','focus-clamp':'玻璃'})[b.dataset.extra];b.setAttribute('aria-label',tr(label));b.title=tr(label);});detail.querySelector('[data-extra="clamp"]').setAttribute('aria-pressed',String(api.state.clampOff));sleeveTools.querySelectorAll('button').forEach(b=>{const label=tr(b.dataset.extra==='flip'?'翻转唱片封套':'背面资料');b.setAttribute('aria-label',label);b.title=label;});cards.forEach((c,i)=>c.querySelector('.lr-record-back').innerHTML=title(api.tracks[+c.dataset.lrTrack]));refreshStatus();
 }
 function browse(direction){const pos=Math.max(0,cards.findIndex(c=>+c.dataset.lrTrack===selectedIndex()));api.play(+cards[(pos+direction+cards.length)%cards.length].dataset.lrTrack);}
 function flip(){const card=cards.find(c=>+c.dataset.lrTrack===selectedIndex());if(!card)return;card.classList.toggle('lr-record-flipped');sleeveTools.querySelector('[data-extra="flip"]').setAttribute('aria-pressed',String(card.classList.contains('lr-record-flipped')));}
 function edit(){if(editDialog)return;const t=api.current(),record={...t,...library.notes[t.id]};editDialog=document.createElement('dialog');editDialog.className='lr-edit-dialog lr-room';editDialog.dataset.theme=api.state.theme;editDialog.innerHTML='<form method="dialog"><h3>'+esc(name(t))+'</h3><label>'+tr('歌手')+'<input name="artist" maxlength="100" value="'+esc(record.artist||'')+'"></label><label>'+tr('年份')+'<input name="year" maxlength="12" value="'+esc(record.year||'')+'"></label><label>'+tr('我的听歌笔记')+'<textarea name="note" rows="4" maxlength="2000">'+esc(record.note||'')+'</textarea></label><div><button value="cancel">'+tr('取消')+'</button><button value="save">'+tr('保存')+'</button></div></form>';document.body.append(editDialog);editDialog.addEventListener('close',()=>{if(editDialog.returnValue==='save'){const form=editDialog.querySelector('form');library.notes[t.id]={artist:form.elements.artist.value,year:form.elements.year.value,note:form.elements.note.value};persist();api.notify();}editDialog.remove();editDialog=null;});editDialog.showModal();}
 on(root,'click',e=>{const control=e.target.closest('[data-extra]');if(!control)return;const action=control.dataset.extra;if(action==='favorite-current'){const id=api.current().id;library.favorites=library.favorites.includes(id)?library.favorites.filter(v=>v!==id):[...library.favorites,id];persist();api.notify();}else if(action==='noise'){if(noiseEnabled){noiseEnabled=false;update();}else enableNoise().then(ok=>{if(disposed)return;if(ok){noiseEnabled=true;update();}else message(tr('当前浏览器无法启用底噪。'));}).catch(()=>message(tr('底噪暂时无法启用。')));}else if(action==='clamp')clamp();else if(action==='edit')edit();else if(action==='flip')flip();else if(action.startsWith('focus-'))focus(action.slice(6));else if(action==='overview')reset();});
 on(tools.querySelector('.lr-sleep'),'change',e=>stopLater(e.target.value));
 on(shelf,'click',e=>{const card=e.target.closest('[data-lr-track]');if(!card||Date.now()<suppressUntil)return;const index=+card.dataset.lrTrack;if(index!==api.state.index)api.play(index);else flip();});
 on(shelf,'dblclick',e=>{const card=e.target.closest('[data-lr-track]');if(card){card.classList.remove('lr-record-flipped');api.play(+card.dataset.lrTrack);}});
 on(shelf,'keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();if(e.key==='Home')api.play(0);else if(e.key==='End')api.play(+cards[cards.length-1].dataset.lrTrack);else browse(e.key==='ArrowRight'?1:-1);cards.find(c=>+c.dataset.lrTrack===selectedIndex())?.focus({preventScroll:true});});
 on(shelf,'wheel',e=>{if(e.ctrlKey)return;const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;if(!delta)return;e.preventDefault();if(performance.now()-lastWheel<350)return;lastWheel=performance.now();browse(Math.sign(delta));},{passive:false});
 function clearDrop(){scene.classList.remove('lr-drop-target');root.classList.remove('lr-sleeve-dragging');ghost?.remove();ghost=null;}
 on(shelf,'dragstart',e=>{const card=e.target.closest('[data-lr-track]');if(!card)return;dragged=+card.dataset.lrTrack;e.dataTransfer.setData('application/x-luliy-record',String(dragged));e.dataTransfer.effectAllowed='copy';root.classList.add('lr-sleeve-dragging');});
 on(scene,'dragover',e=>{if(dragged===null)return;e.preventDefault();scene.classList.add('lr-drop-target');});on(scene,'dragleave',e=>{if(!scene.contains(e.relatedTarget))scene.classList.remove('lr-drop-target');});on(scene,'drop',e=>{if(dragged===null)return;e.preventDefault();const index=dragged;dragged=null;clearDrop();api.play(index);});on(shelf,'dragend',()=>{dragged=null;suppressUntil=Date.now()+400;clearDrop();});
 // A horizontal touch swipe browses; holding a sleeve lifts it for a deck drop.
 on(shelf,'pointerdown',e=>{if(e.button!==0)return;const card=e.target.closest('[data-lr-track]');gesture={id:e.pointerId,x:e.clientX,y:e.clientY,index:card?+card.dataset.lrTrack:selectedIndex(),card,active:false};if(e.pointerType!=='mouse'&&card)holdTimer=setTimeout(()=>{if(!gesture)return;gesture.active=true;card.setPointerCapture(e.pointerId);root.classList.add('lr-sleeve-dragging');ghost=document.createElement('img');ghost.className='lr-drag-ghost';ghost.src=api.artwork(api.tracks[gesture.index]);document.body.append(ghost);ghost.style.left=gesture.x+'px';ghost.style.top=gesture.y+'px';},420);});
 on(shelf,'pointermove',e=>{if(!gesture||gesture.id!==e.pointerId)return;if(!gesture.active){if(Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>8)clearTimeout(holdTimer);return;}e.preventDefault();ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';const r=scene.getBoundingClientRect();scene.classList.toggle('lr-drop-target',e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom);},{passive:false});
 function endGesture(e){clearTimeout(holdTimer);if(!gesture||gesture.id!==e.pointerId)return;const g=gesture;gesture=null;if(g.card?.hasPointerCapture(e.pointerId))g.card.releasePointerCapture(e.pointerId);if(g.active){suppressUntil=Date.now()+500;const valid=scene.classList.contains('lr-drop-target')&&e.type!=='pointercancel';clearDrop();if(valid)api.play(g.index);}else if(e.type!=='pointercancel'&&Math.abs(e.clientX-g.x)>35&&Math.abs(e.clientX-g.x)>Math.abs(e.clientY-g.y)){suppressUntil=Date.now()+500;browse(e.clientX<g.x?1:-1);}}
 on(shelf,'pointerup',endGesture);on(shelf,'pointercancel',endGesture);
 let reorderIndex=null;
 function moveOrder(from,to){const indices=order(),a=indices.indexOf(from),b=indices.indexOf(to);if(a<0||b<0||a===b)return;indices.splice(a,1);indices.splice(b,0,from);library.order=indices.map(i=>api.tracks[i].id);persist();reorder();message(tr('播放顺序已更新。'));}

 on(album,'dragstart',e=>{const li=e.target.closest('[data-order-track]');if(!li)return;reorderIndex=+li.dataset.orderTrack;e.dataTransfer.setData('application/x-luliy-order',String(reorderIndex));e.dataTransfer.effectAllowed='move';});on(album,'dragover',e=>{if(reorderIndex===null)return;const li=e.target.closest('[data-order-track]');if(li){e.preventDefault();album.querySelectorAll('.lr-order-target').forEach(n=>n.classList.remove('lr-order-target'));li.classList.add('lr-order-target');}});on(album,'drop',e=>{const li=e.target.closest('[data-order-track]');if(li&&reorderIndex!==null){e.preventDefault();moveOrder(reorderIndex,+li.dataset.orderTrack);}reorderIndex=null;album.querySelectorAll('.lr-order-target').forEach(n=>n.classList.remove('lr-order-target'));});on(album,'dragend',()=>{reorderIndex=null;album.querySelectorAll('.lr-order-target').forEach(n=>n.classList.remove('lr-order-target'));});
 on(album,'click',e=>{const up=e.target.closest('[data-order-up]'),down=e.target.closest('[data-order-down]');if(!up&&!down)return;e.stopPropagation();const from=+(up?.dataset.orderUp??down.dataset.orderDown),indices=order(),destination=indices.indexOf(from)+(up?-1:1);if(destination>=0&&destination<indices.length)moveOrder(from,indices[destination]);});
 reorder();const instance={update,browse,message,destroy(){disposed=true;instances.delete(instance);clearTimeout(holdTimer);clearTimeout(notificationTimer);clearDrop();editDialog?.close();if(!instances.size){noiseEnabled=false;clearTimer();syncNoise();}}};instances.add(instance);update();return instance;
}
window.LuliyRecordExtras={configure,attach,update,volume:syncNoise,onPlay:syncNoise,onEnded,order,stopLater,sleepState:()=>timer?{...timer}:null,favorite:id=>library.favorites.includes(id),toggleFavorite:id=>{library.favorites=library.favorites.includes(id)?library.favorites.filter(v=>v!==id):[...library.favorites,id];persist();api.notify();}};
})();

/* Record player for user-selected audio files. */
(function () {
  'use strict';
  if (window.LuliyRecords) return;
  const texts = {"zh":{"room":"听觉的留白","library":"我的唱片","play":"播放","pause":"暂停","previous":"上一张唱片","next":"下一张唱片","eject":"弹出唱片","choose":"挑一张唱片","empty":"唱片已弹出。","view":"唱机视角","hint":"拖动旋转 · 双指缩放 · 方向键 / + − / Home","viewHelp":"唱机视角：拖动旋转，双指缩放；方向键调整，加减键缩放，Home 复位。","zoomIn":"放大视角","zoomOut":"缩小视角","reset":"复位视角","seek":"播放进度","volume":"音量","mute":"静音","unmute":"取消静音","shelfPrevious":"向前浏览唱片","shelfNext":"向后浏览唱片","ready":"选择一首，开始播放。","playing":"正在播放","paused":"已暂停","loading":"正在加载音频…","error":"音频暂时无法播放。","close":"关闭并停止迷你播放器","mini":"迷你播放器","album":"播放列表","openRecords":"打开播放列表","closeAlbum":"关闭播放列表","sequence":"顺序播放","shuffle":"随机播放","repeatOne":"单曲循环"},"en":{"room":"Room for listening","library":"My records","play":"Play","pause":"Pause","previous":"Previous record","next":"Next record","eject":"Eject record","choose":"Choose a record","empty":"The turntable is empty.","view":"Turntable view","hint":"Drag to turn · Pinch to zoom · Arrows / + − / Home","viewHelp":"Drag to rotate, pinch to zoom. Arrow keys rotate, plus and minus zoom, Home resets the view.","zoomIn":"Zoom in","zoomOut":"Zoom out","reset":"Reset view","seek":"Playback position","volume":"Volume","mute":"Mute","unmute":"Unmute","shelfPrevious":"Browse previous records","shelfNext":"Browse next records","ready":"Choose a record to listen.","playing":"Playing","paused":"Paused","loading":"Loading audio…","error":"Audio could not be played.","close":"Close and stop mini player","mini":"Mini player","album":"Playlist","openRecords":"Open playlist","closeAlbum":"Close playlist","sequence":"Play in order","shuffle":"Shuffle","repeatOne":"Repeat one"},"ja":{"room":"耳を澄ます余白","library":"私のレコード","play":"再生","pause":"一時停止","previous":"前のレコード","next":"次のレコード","eject":"レコードを取り出す","choose":"レコードを選ぶ","empty":"レコードを取り出しました。","view":"ターンテーブルの視点","hint":"ドラッグで回転 · ピンチで拡大縮小 · 矢印 / + − / Home","viewHelp":"ドラッグで回転、二本指で拡大縮小。方向キーで回転、プラス・マイナスで拡大縮小、Home でリセット。","zoomIn":"拡大","zoomOut":"縮小","reset":"視点をリセット","seek":"再生位置","volume":"音量","mute":"ミュート","unmute":"ミュート解除","shelfPrevious":"前のレコードを見る","shelfNext":"次のレコードを見る","ready":"レコードを選んで再生。","playing":"再生中","paused":"一時停止中","loading":"音声を読み込み中…","error":"音声を再生できません。","close":"閉じて再生を停止","mini":"ミニプレーヤー","album":"再生リスト","openRecords":"再生リストを開く","closeAlbum":"再生リストを閉じる","sequence":"順番に再生","shuffle":"シャッフル","repeatOne":"一曲リピート"}};
  for(const [lang,message] of Object.entries({zh:'正在换片…',en:'Changing record…',ja:'レコードを交換中…'}))texts[lang].changing=message;
  for(const [lang,message] of Object.entries({zh:'正在缓冲音频…',en:'Buffering audio…',ja:'音声をバッファ中…'}))texts[lang].buffering=message;
  for(const [lang,message] of Object.entries({zh:' 拖动唱臂调整进度；左下旋钮调节音量。',en:' Drag the tonearm to seek; drag the lower-left knob to adjust volume.',ja:' アームをドラッグして再生位置、左下のノブで音量を調整。'}))texts[lang].viewHelp+=message;
  texts.zh.error='音频未能播放 · 点击播放重试';texts.en.error='Audio unavailable · press play to retry';texts.ja.error='再生できません・再生ボタンで再試行';
  const suppliedTracks = window.LULIY_DATA?.collections?.records;
  const fallbackTracks = [{"id":"qingge","name":{"zh":"情歌","en":"Qing Ge","ja":"情歌"},"src":"https://cloud.luliy.me/api/audio?path=shared%2F%E6%83%85%E6%AD%8C%E4%B8%80%E4%B8%AA%E7%90%83.mp3","duration":251,"color":"#b9a39a"},{"id":"call-me-now","name":{"zh":"Call Me Now","en":"Call Me Now","ja":"Call Me Now"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FCall_Me_Now-Serlek-Yarim-bolmisun.mp3","duration":null,"color":"#989fa8"},{"id":"dark","name":{"zh":"dark","en":"dark","ja":"dark"},"src":"https://cloud.luliy.me/api/audio?path=shared%2Fdark.mp3","duration":166,"color":"#858d92"},{"id":"yesterday","name":{"zh":"Yesterday","en":"Yesterday","ja":"Yesterday"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FYesterday.mp3","duration":60,"color":"#b9ae94"},{"id":"someone-like-you","name":{"zh":"Echos","en":"Echos","ja":"Echos"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FSomeone%20Like%20You.mp3","duration":160,"color":"#aea195"},{"id":"one-to-two","name":{"zh":"1 to 2","en":"1 to 2","ja":"1 to 2"},"src":"https://cloud.luliy.me/api/audio?path=shared%2F1%20to%202%20.mp3","duration":null,"color":"#a69b9b"},{"id":"something-just-like-this-megamix","name":{"zh":"Something Just Like This (Megamix)","en":"Something Just Like This (Megamix)","ja":"Something Just Like This (Megamix)"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FSOMETHING%20JUST%20LIKE%20THIS%20(Megamix)%20.mp3","duration":null,"color":"#b6a184"},{"id":"sa-ye","name":{"zh":"撒野","en":"Sa Ye","ja":"撒野"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FWendy%2F%E7%9B%8A%E5%96%84-%E6%92%92%E9%87%8E-%20%E5%8C%BA.mp3","duration":null,"color":"#a39993"},{"id":"zhe-shi-jie-na-me-duo-ren","name":{"zh":"这世界那么多人","en":"So Many People in This World","ja":"这世界那么多人"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FWendy%2F%E7%9B%8A%E5%96%84-%E8%BF%99%E4%B8%96%E7%95%8C%E9%82%A3%E4%B9%88%E5%A4%9A%E4%BA%BA.mp3","duration":null,"color":"#949c9b"},{"id":"zui-hou-yi-ye","name":{"zh":"最后一页","en":"The Last Page","ja":"最后一页"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FWendy%2F%E7%9B%8A%E5%96%84-%E6%9C%80%E5%90%8E%E4%B8%80%E9%A1%B5-.mp3","duration":null,"color":"#ada59c"},{"id":"love-story","name":{"zh":"Love Story","en":"Love Story","ja":"Love Story"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FWendy%2F%E7%9B%8A%E5%96%84-Love%20Story.mp3","duration":null,"color":"#b1a6a1"},{"id":"wendy","name":{"zh":"Wendy","en":"Wendy","ja":"Wendy"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FWendy%2FWendy.mp3","duration":null,"color":"#a4aaa4"},{"id":"black-magic","name":{"zh":"Black Magic","en":"Black Magic","ja":"Black Magic"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FBlack%20Magic%20-%20Jonasu.mp3","duration":null,"color":"#94909e"},{"id":"dance-monkey","name":{"zh":"Dance Monkey","en":"Dance Monkey","ja":"Dance Monkey"},"src":"https://cloud.luliy.me/api/audio?path=shared%2FDance%20Monkey%20-%20Tones%20And%20I.mp3","duration":null,"color":"#a28e85"}];
  const tracks = Array.isArray(suppliedTracks) && suppliedTracks.some(track => track?.src)
    ? suppliedTracks.filter(track => track?.id && track?.name && track?.src)
    : fallbackTracks;
  for (const lang of Object.keys(texts)) texts[lang].albumHint = tracks.length + (lang === 'zh' ? ' 首曲目' : lang === 'ja' ? ' 曲' : ' tracks');
  const paths = {play:'M8 5l11 7-11 7z',pause:'M8 5v14M16 5v14',previous:'M6 5v14M18 5L8 12l10 7z',next:'M18 5v14M6 5l10 7-10 7z',eject:'M5 15l7-10 7 10zM5 19h14',minus:'M5 12h14',plus:'M5 12h14M12 5v14',reset:'M4 9a8 8 0 1 1 0 6M4 3v6h6',left:'M15 5l-7 7 7 7',right:'M9 5l7 7-7 7',close:'M6 6l12 12M18 6L6 18',volume:'M4 9h4l5-4v14l-5-4H4zM16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14',mute:'M4 9h4l5-4v14l-5-4H4zM17 9l5 6M22 9l-5 6',sequence:'M3 7h14m-3-3 3 3-3 3M3 17h14m-3-3 3 3-3 3',shuffle:'M3 6h3c5 0 7 12 12 12M17 15l3 3-3 3M3 18h3c2 0 3-2 4-4M14 9c2-2 3-3 6-3M17 3l3 3-3 3',repeat:'M4 8V6a2 2 0 0 1 2-2h13l-3-3M19 4l-3 3M20 16v2a2 2 0 0 1-2 2H5l3 3M5 20l3-3'};
  const icon = name => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+paths[name]+'"/></svg>';
  const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  const time = seconds => Number.isFinite(seconds) && seconds >= 0
    ? Math.floor(seconds/60)+':'+String(Math.floor(seconds%60)).padStart(2,'0') : '—:—';
  const durationLabel = seconds => Number(seconds)>0?time(seconds):'時長未知';
  const durationOf = track => Number(track?.duration) > 0 ? Number(track.duration) : 0;
  const mounts = new Set(),subscribers=new Map();
  const state = {index:0,playing:false,started:false,loading:false,buffering:false,error:false,position:0,volume:.45,muted:false,shuffle:false,repeatOne:false,lang:'zh',theme:'dark',generation:0,enhanced:false,clampOff:false,resting:false};
  let media=null,mini=null,previousVolume=.45,envelope=1,fadeSerial=0,listeningGain=1,listeningGainFrame=0;const extras=window.LuliyRecordExtras;const shuffleHistory=[];
  const storageKey='luliy-record-preferences';
  try{const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');if(Number.isFinite(saved.volume))state.volume=clamp(saved.volume,0,1);const index=tracks.findIndex(track=>track.id===saved.track);if(index>=0)state.index=index;state.shuffle=!!saved.shuffle;state.repeatOne=!!saved.repeatOne;}catch(e){}
  const savePreferences=()=>{try{localStorage.setItem(storageKey,JSON.stringify({track:current().private?null:current().id,shuffle:state.shuffle,repeatOne:state.repeatOne,position:current().private?0:elapsed(),volume:state.volume}));}catch(e){}};
  const dictionary = () => texts[state.lang];
  let mediaQueue=null;
  const current = () => tracks[state.index] || tracks[0];
  const artwork = track => track.cover || track.image || window.LULIY_DATA?.recordCovers?.[track.id] || '';
  const elapsed = () => state.exchange ? state.position : media && state.index >= 0 && media.currentSrc === current().src && Number.isFinite(media.currentTime)
    ? media.currentTime : state.position;
  function snapshot(){
    const track=current(),empty=state.index<0;
    return {index:state.index,track:empty?null:track.id,name:track.name[state.lang]||track.name.zh,title:track.name.en||track.name.zh,number:Math.max(0,state.index)+1,cover:artwork(track),duration:durationOf(track),playing:state.playing,started:state.started,loading:state.loading,buffering:state.buffering,exchanging:state.exchange?.kind||null,exchange:state.exchange?{...state.exchange}:null,ejected:empty,clampOff:state.clampOff,resting:state.resting,error:state.error,position:elapsed(),volume:state.volume,muted:state.muted,lang:state.lang,theme:state.theme,shuffle:state.shuffle,repeatOne:state.repeatOne};
  }
  function publish(){if(!subscribers.size)return;const next=snapshot();subscribers.forEach((options,listener)=>listener(next));}
  function subscribe(listener,options={}){
    if(typeof listener!=='function')throw new TypeError('Record subscriber must be a function');
    subscribers.set(listener,options);if(typeof options.enhanced==='boolean')state.enhanced=options.enhanced;
    listener(snapshot());updateMini();
    return ()=>{subscribers.delete(listener);updateMini();};
  }

  function cover(index,extra) {
    const track=tracks[index],n=String(index+1).padStart(2,'0');if(track.private&&artwork(track))return '<span class="lr-cover lr-private-artwork" aria-hidden="true"><img src="'+esc(artwork(track))+'" alt=""></span>';
    return '<span class="lr-cover lr-art-'+index+' lr-composition-'+(index%4)+' '+(extra||'')+'" style="--lr-cover-bg:'+track.color+'" aria-hidden="true"><span class="lr-cover-art"><i></i><i></i><i></i></span><span class="lr-cover-top">LULIY / RECORDS</span><span class="lr-cover-number">'+n+'</span><span class="lr-cover-title" style="--title-size:'+(track.name.zh.length>24?'11':track.name.zh.length>12?'14':'21')+'cqw">'+esc(track.name.zh)+'</span><span class="lr-cover-bottom">VOL. '+n+' / PERSONAL COLLECTION</span></span>';
  }
  function button(action,label,shape,extra) {
    return '<button type="button" class="lr-icon-button '+(extra||'')+'" data-lr-action="'+action+'" data-lr-aria="'+label+'" aria-label="'+esc(dictionary()[label])+'" title="'+esc(dictionary()[label])+'">'+icon(shape)+'</button>';
  }
  function ensureAudio() {
    if(media)return;
    media=new Audio();media.preload='auto';media.volume=state.volume;
    for(const event of ['waiting','stalled'])media.addEventListener(event,()=>{if(state.playing&&!state.exchange&&media.src===current().src&&!state.buffering){state.buffering=true;notify();}});
    media.addEventListener('playing',()=>{if(state.buffering){state.buffering=false;notify();}});
    media.addEventListener('loadedmetadata',()=>{
      if(state.index<0||media.src!==current().src)return;
      if(Number.isFinite(media.duration)&&media.duration>0)current().duration=media.duration;
      if(state.position>0&&Number.isFinite(media.duration))media.currentTime=Math.min(state.position,media.duration);
      notify();
    });
    media.addEventListener('durationchange',()=>{
      if(state.index<0||media.src!==current().src)return;
      if(Number.isFinite(media.duration)&&media.duration>0){current().duration=media.duration;notify();}
    });
    media.addEventListener('timeupdate',()=>{if(state.exchange||media.src!==current().src)return;state.position=media.currentTime;syncProgress();});
    media.addEventListener('ended',()=>{if(state.index<0||state.exchange||media.src!==current().src)return;if(extras?.onEnded())return;if(state.repeatOne&&!current().revoked){state.position=0;media.currentTime=0;play();}else advance(1);});
    media.addEventListener('error',()=>{if(!state.started)return;state.loading=false;state.buffering=false;state.playing=false;state.error=true;notify();});
  }
  // One shared clock keeps audio and every visible turntable in step. Selecting
  // another track during a change updates the destination without restarting it.
  let exchangePromise=null,exchangeResolve=null,exchangeTimer=null,exchangeSerial=0;
  function startExchange(kind,fromEmpty=false) {
    if(state.exchange?.kind==='swap'&&kind==='swap')return exchangePromise;
    clearTimeout(exchangeTimer);exchangeResolve?.();
    const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?100:kind==='eject'?2600:4600;
    const exchange={id:++exchangeSerial,start:performance.now(),duration,kind,fromEmpty};
    state.exchange=exchange;
    exchangePromise=new Promise(resolve=>{exchangeResolve=resolve;});
    exchangeTimer=setTimeout(()=>{
      if(state.exchange!==exchange)return;
      state.exchange=null;exchangeResolve?.();exchangeResolve=null;notify();
    },duration);
    notify();return exchangePromise;
  }
  // Buffer the already selected source during the mechanical exchange. Seeking
  // commits once on release, avoiding repeated remote range requests while dragging.
  function bufferedReady(generation){
    if(media.readyState>=4)return Promise.resolve();
    return new Promise((resolve,reject)=>{
      let timer=0;const started=performance.now();
      const finish=error=>{clearTimeout(timer);for(const event of ['progress','canplay','canplaythrough','error'])media.removeEventListener(event,check);error?reject(error):resolve();};
      const check=()=>{
        clearTimeout(timer);
        if(generation!==state.generation){finish();return;}
        if(media.error){finish(Error('Audio could not be loaded'));return;}
        let ahead=0;for(let i=0;i<media.buffered.length;i++)if(media.buffered.start(i)<=media.currentTime+.1&&media.buffered.end(i)>media.currentTime)ahead=media.buffered.end(i)-media.currentTime;
        const remaining=Number.isFinite(media.duration)?media.duration-media.currentTime:5;
        if(media.readyState>=4||media.readyState>=3&&ahead>=Math.min(5,remaining)){finish();return;}
        if(performance.now()-started>45000){finish(Error('Audio buffering timed out'));return;}
        timer=setTimeout(check,200);
      };
      for(const event of ['progress','canplay','canplaythrough','error'])media.addEventListener(event,check);check();
    });
  }
  function applyAudioVolume(){if(media)media.volume=clamp(state.volume*envelope*listeningGain,0,1);}
  function setListeningGain(value,duration=500){
    cancelAnimationFrame(listeningGainFrame);const to=clamp(Number(value)||0,0,1),from=listeningGain,start=performance.now();
    const step=now=>{const p=duration>0?clamp((now-start)/duration,0,1):1;listeningGain=from+(to-from)*(p*p*(3-2*p));applyAudioVolume();listeningGainFrame=p<1?requestAnimationFrame(step):0;};listeningGainFrame=requestAnimationFrame(step);
  }
  function fadeTo(target,duration,generation=state.generation){
    const serial=++fadeSerial,from=envelope,start=performance.now();
    return new Promise(resolve=>{function step(now){
      if(serial!==fadeSerial||generation!==state.generation){resolve(false);return;}
      const t=clamp((now-start)/duration,0,1);envelope=from+(target-from)*(t*t*(3-2*t));applyAudioVolume();
      if(t<1)requestAnimationFrame(step);else resolve(true);
    }requestAnimationFrame(step);});
  }
  async function softStop(){
    const generation=state.generation;
    if(state.playing&&!(await fadeTo(0,1000,generation)))return;
    if(generation!==state.generation)return;
    pause();state.resting=true;envelope=1;applyAudioVolume();notify();
  }
  let clampResume=false;
  async function toggleClamp(){
    if(state.exchange||state.index<0)return;
    if(!state.clampOff){clampResume=state.playing;pause();state.clampOff=true;state.resting=true;notify();}
    else{state.clampOff=false;notify();const generation=state.generation;await new Promise(r=>setTimeout(r,700));if(generation!==state.generation)return;state.resting=false;if(clampResume)play();else notify();}
  }
  let roomQueueSerial=0;
  async function play(index,resumePosition,forceSwap=false,keepQueue=false) {
    if(Number.isInteger(index)&&!keepQueue){if(!tracks[index]?.private){mediaQueue=null;shuffleHistory.length=0;}else if(!mediaQueue?.includes(tracks[index].id)){mediaQueue=tracks.filter(t=>t.private&&!t.revoked).map(t=>t.id);shuffleHistory.length=0;}}
    const roomOptions=[...subscribers.values()].filter(o=>typeof o.beforeExchange==='function');if(state.exchange?.kind==='swap'&&roomOptions.length){const ticket=++roomQueueSerial;await exchangePromise;if(ticket!==roomQueueSerial||!roomOptions.some(o=>[...subscribers.values()].includes(o)))return;return play(index,resumePosition,forceSwap,keepQueue);}

    const next=Number.isInteger(index)?clamp(index,0,tracks.length-1):(state.index<0?0:state.index);
    const changed=next!==state.index,fromEmpty=state.index<0,wasPlaying=state.playing;
    savePreferences();
    const generation=++state.generation;ensureAudio();
    const preparers=[...subscribers.values()].filter(options=>typeof options.beforeExchange==='function');const firstRoomPlay=!state.started&&preparers.length>0;if((changed||firstRoomPlay||forceSwap)&&preparers.length){await Promise.all(preparers.map(options=>options.beforeExchange()));if(generation!==state.generation||!preparers.some(options=>[...subscribers.values()].includes(options)))return;}
    const mechanical=(changed||state.exchange||firstRoomPlay||forceSwap)?startExchange('swap',fromEmpty):null;
    if(changed){state.index=next;state.position=Math.max(0,Number(resumePosition)||0);}
    state.clampOff=false;state.resting=false;state.started=true;state.loading=true;state.buffering=false;state.playing=false;state.error=false;ensureMini();notify();
    try {
      if(state.enhanced&&changed&&wasPlaying){if(!(await fadeTo(0,320,generation)))return;}
      if(generation!==state.generation)return;
      const selected=current();if(selected.resolveSource&&(changed||!selected.src||media.error||media.networkState===3)){const resolved=await selected.resolveSource();if(generation!==state.generation||current()!==selected)return;selected.src=resolved;}
      if(changed||media.src!==current().src||media.error||media.networkState===3){media.pause();media.src=current().src;media.load();}
      if(mechanical){await mechanical;if(generation!==state.generation)return;}
      await bufferedReady(generation);if(generation!==state.generation)return;
      envelope=state.enhanced?0:1;applyAudioVolume();await media.play();
      if(generation!==state.generation)return;
      state.playing=true;state.loading=false;savePreferences();extras?.onPlay();notify();
      if(state.enhanced)fadeTo(1,700,generation);
    } catch(error) {
      if(generation!==state.generation)return;
      console.warn('Audio playback:',error.name,error.message);
      state.loading=false;state.buffering=false;state.playing=false;state.error=true;envelope=1;applyAudioVolume();notify();
    }
  }
  function advance(direction){const available=mediaLibrary.queue().map(t=>tracks.findIndex(x=>x.id===t.id));if(!available.length){pause();return;}let next;const pos=available.indexOf(state.index);if(state.shuffle&&available.length>1){const choices=available.filter(i=>i!==state.index);if(direction<0&&shuffleHistory.length){const prior=shuffleHistory.pop();next=available.includes(prior)?prior:choices[Math.floor(Math.random()*choices.length)];}else{next=choices[Math.floor(Math.random()*choices.length)];if(direction>0)shuffleHistory.push(state.index);}}else next=available[(pos+direction+available.length)%available.length];play(next,undefined,false,true);}
  function pause() {
    roomQueueSerial++;
    state.position=elapsed();state.generation++;
    if(media)media.pause();
    state.playing=false;state.loading=false;state.buffering=false;fadeSerial++;envelope=1;applyAudioVolume();savePreferences();notify();
  }
  function toggle() {if(state.playing||state.loading)pause();else play();}
  function select(index) {
    if(!tracks[index]?.private)mediaQueue=null;
    if(index===state.index){toggle();return;}
    play(index);
  }
  function setOrder(shuffle){state.shuffle=shuffle;state.repeatOne=false;shuffleHistory.length=0;savePreferences();notify();}
  function setMode(mode){state[mode]=!state[mode];if(mode==='repeatOne'&&state.repeatOne){state.shuffle=false;shuffleHistory.length=0;}savePreferences();notify();}
  function eject() {
    if(state.index<0&&!state.exchange)return;
    pause();if(media){media.removeAttribute('src');media.load();}
    state.index=-1;state.position=0;state.started=false;state.error=false;startExchange('eject');
  }
  function seek(value) {
    const duration=durationOf(current());
    state.position=clamp(Number(value)||0,0,duration);
    if(media&&media.currentSrc&&media.readyState>=1)media.currentTime=state.position;
    notify();
  }
  function setVolume(value) {
    state.volume=clamp(Number(value)||0,0,1);state.muted=state.volume===0;
    applyAudioVolume();savePreferences();
    mounts.forEach(m=>m.volume());
    extras?.volume?.();publish();
  }
  function mute() {
    if(state.volume>0){previousVolume=state.volume;setVolume(0);}else setVolume(previousVolume||.45);
  }
  function notify() {mounts.forEach(m=>m.update());updateMini();extras?.update();publish();}
  // Native timeupdate already follows the audio clock. A second interval did
  // the same work between events, including while the tab was in the background.
  function syncProgress() {if(document.hidden)return;mounts.forEach(m=>m.progress());updateMiniProgress();publish();}
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncProgress();});
  function ensureMini() {
    if(mini&&mini.isConnected)return;
    mini=document.createElement('aside');mini.className='lr-mini';mini.setAttribute('aria-label',dictionary().mini);
    mini.innerHTML='<button type="button" class="lr-mini-open" data-lr-mini="open"><span class="lr-mini-cover"></span><span class="lr-mini-copy"><span class="lr-mini-title"></span><span class="lr-mini-caption"></span></span></button><div class="lr-mini-controls"><button type="button" class="lr-mini-skip" data-lr-mini="previous"></button><button type="button" class="lr-mini-play" data-lr-mini="play"></button><button type="button" class="lr-mini-skip" data-lr-mini="next"></button><button type="button" class="lr-mini-close" data-lr-mini="close">'+icon('close')+'</button></div><div class="lr-mini-progress"><span class="lr-mini-elapsed">0:00</span><input type="range" min="0" max="1" step=".1" value="0" class="lr-mini-seek" data-lr-aria="seek"><span class="lr-mini-duration">—:—</span></div>';
    document.body.append(mini);
    mini.addEventListener('click',event=>{if(event.target.closest('.lr-mini-progress'))return;const action=event.target.closest('[data-lr-mini]');if(!action){document.dispatchEvent(new CustomEvent('luliy:records-open'));return;}if(action.dataset.lrMini==='close')eject();else if(action.dataset.lrMini==='open')document.dispatchEvent(new CustomEvent('luliy:records-open'));else if(action.dataset.lrMini==='play')toggle();else if(action.dataset.lrMini==='previous')advance(-1);else if(action.dataset.lrMini==='next')advance(1);});
    const seekInput=mini.querySelector('.lr-mini-seek');
    seekInput.addEventListener('input',()=>{mini.querySelector('.lr-mini-elapsed').textContent=time(+seekInput.value);});
    seekInput.addEventListener('change',()=>seek(seekInput.value));
    updateMini();
  }
  function updateMini() {
    if(!mini)return;
    const d=dictionary(),track=current();mini.hidden=!state.started||Array.from(mounts).some(m=>m.controlsVisible)||Array.from(subscribers.values()).some(options=>options.controlsVisible);mini.dataset.theme=state.theme;mini.dataset.error=String(state.error);mini.setAttribute('aria-label',d.mini);
    const miniCover=mini.querySelector('.lr-mini-cover');
    mini.querySelector('.lr-mini-open').setAttribute('aria-label',d.openRecords);
    if(miniCover.dataset.index!==String(state.index)||miniCover._artwork!==artwork(track)){miniCover._artwork=artwork(track);miniCover.innerHTML=cover(Math.max(0,state.index));miniCover.dataset.index=String(state.index);}
    mini.querySelector('.lr-mini-title').textContent=track.name[state.lang];
    mini.querySelector('.lr-mini-caption').textContent=state.error?d.error:(state.loading?d.loading:state.buffering?d.buffering:state.playing?d.playing:d.paused);
    const playButton=mini.querySelector('.lr-mini-play');playButton.setAttribute('aria-label',state.playing?d.pause:d.play);playButton.setAttribute('aria-pressed',String(state.playing));
    playButton.innerHTML=icon(state.playing?'pause':'play')+'<svg class="lr-mini-ring" viewBox="0 0 42 42" aria-hidden="true"><circle cx="21" cy="21" r="18"/></svg>';
    mini.querySelector('[data-lr-mini="previous"]').innerHTML=icon('previous');mini.querySelector('[data-lr-mini="previous"]').setAttribute('aria-label',d.previous);
    mini.querySelector('[data-lr-mini="next"]').innerHTML=icon('next');mini.querySelector('[data-lr-mini="next"]').setAttribute('aria-label',d.next);
    mini.querySelector('.lr-mini-close').setAttribute('aria-label',d.close);mini.querySelector('.lr-mini-seek').setAttribute('aria-label',d.seek);updateMiniProgress();
  }
  function updateMiniProgress() {
    if(!mini||mini.hidden)return;
    const duration=durationOf(current())||(media&&Number.isFinite(media.duration)?media.duration:0),position=elapsed(),seekInput=mini.querySelector('.lr-mini-seek');
    if(!seekInput.matches(':active'))seekInput.value=position;
    seekInput.max=duration||1;seekInput.disabled=!duration;seekInput.setAttribute('aria-valuetext',time(position)+' / '+time(duration));
    if(!seekInput.matches(':active'))mini.querySelector('.lr-mini-elapsed').textContent=time(position);mini.querySelector('.lr-mini-duration').textContent=duration?'−'+time(Math.max(0,duration-position)):'—:—';
    mini.style.setProperty('--lr-ring',String(113.1*(1-(duration?position/duration:0))));
  }
  function setLang(lang) {
    state.lang=texts[lang]?lang:'zh';notify();
  }
  function setTheme(theme) {
    state.theme=theme==='light'?'light':'dark';mounts.forEach(m=>{m.root.dataset.theme=state.theme;m.setModelTheme?.(state.theme);});if(mini)mini.dataset.theme=state.theme;publish();
  }
  function mount(container,options) {
    if(typeof container==='string')container=document.querySelector(container);
    if(!container)throw new Error('LuliyRecords.mount needs a container');
    options=options||{};
    // Enhanced controls and presentation belong exclusively to the record page.
    const standalone=options.layout==='standalone';state.enhanced=standalone;
    state.lang=texts[options.lang]?options.lang:state.lang;
    if(options.theme)state.theme=options.theme==='light'?'light':'dark';
    else if(document.documentElement.dataset.theme)state.theme=document.documentElement.dataset.theme==='light'?'light':'dark';
    const d=dictionary(),root=document.createElement('section');root.className='lr-room '+(standalone?'lr-standalone':'lr-home');root.dataset.theme=state.theme;
    root.innerHTML='<div class="lr-layout"><div class="lr-scene" tabindex="0" role="group" data-lr-aria="viewHelp" aria-label="'+d.viewHelp+'">'+
      '<div class="lr-floor"></div><div class="lr-turntable"><div class="lr-plinth"></div><div class="lr-platter"></div><div class="lr-vinyl"><div class="lr-grooves"><div class="lr-disc-label"><span class="lr-label-title"></span><span class="lr-label-no"></span></div></div></div><div class="lr-spindle"></div><div class="lr-weight" aria-hidden="true"></div><div class="lr-arm-pivot"></div><button type="button" class="lr-tonearm" data-lr-action="play" aria-label="'+d.play+'"><span class="lr-headshell"></span></button><div class="lr-strobe"></div><div class="lr-speed">33 ⅓ RPM</div><div class="lr-cue"></div></div>'+
        '<div class="lr-view-controls">'+button('eject','eject','eject')+'<span class="lr-view-divider"></span>'+button('zoom-out','zoomOut','minus')+button('zoom-in','zoomIn','plus')+button('reset','reset','reset')+'</div></div>'+ 
      '<div class="lr-meta"><p class="lr-counter"></p><h3 class="lr-title"></h3><div class="lr-transport">'+button('previous','previous','previous')+'<button type="button" class="lr-primary" data-lr-action="play"></button>'+button('next','next','next')+'</div><div class="lr-track-progress"><span class="lr-elapsed">0:00</span><input type="range" class="lr-seek" data-lr-aria="seek" aria-label="'+d.seek+'" min="0" max="128" step=".1" value="0"><span class="lr-duration">2:08</span></div><div class="lr-sound-row"><div class="lr-play-modes">'+button('sequence','sequence','sequence')+button('shuffle','shuffle','shuffle')+'</div><div class="lr-volume"><button type="button" class="lr-icon-button lr-mute" data-lr-action="mute" aria-label="'+d.mute+'">'+icon('volume')+'</button><input class="lr-volume-range" data-lr-aria="volume" aria-label="'+d.volume+'" type="range" min="0" max="1" step=".01" value=".45"><span class="lr-volume-output">45%</span></div></div><div class="lr-audio-status" role="status" aria-live="polite"></div><div class="lr-clamp-rest" aria-hidden="true"><div class="lr-rest-weight"></div></div></div></div>'+
      '<div class="lr-shelf-heading"><span class="lr-shelf-label" data-lr-copy="library">'+d.library+'</span><div class="lr-shelf-nav">'+button('shelf-prev','shelfPrevious','left')+button('shelf-next','shelfNext','right')+'</div></div><div class="lr-shelf" role="group" aria-label="'+d.library+'">'+tracks.map((t,i)=>t.private?'':'<button type="button" class="lr-record" data-lr-track="'+i+'" aria-label="'+esc(t.name[state.lang])+'" aria-current="false">'+cover(i)+'<span class="lr-record-name">'+esc(t.name[state.lang])+'</span><span class="lr-record-info">'+String(i+1).padStart(2,'0')+' / '+durationLabel(t.duration)+'</span><span class="lr-record-state" aria-hidden="true"></span></button>').join('')+'</div>';
    container.append(root);
    const scene=root.querySelector('.lr-scene'),deck=root.querySelector('.lr-turntable'),shelf=root.querySelector('.lr-shelf');
    if(!standalone||new URLSearchParams(location.hash.split('?')[1]||'').get('exhibition')!=='1'){
      const entrance=document.createElement('a');entrance.className='lr-exhibition-entry';
      entrance.href='#/music?exhibition=1&lang='+state.lang;
      entrance.textContent=state.lang==='en'?'Enter exhibition':state.lang==='ja'?'展覧会へ':'进入展览';
      scene.querySelector('[data-lr-action="eject"]').after(entrance);
    }

    const seekInput=root.querySelector('.lr-seek'),volumeInput=root.querySelector('.lr-volume-range');
    const cleanups=[];let destroyed=false,suppressClick=false,shelfDrag=null,drag=null,pinch=null,progressVisible=true,view={rx:48,rz:-12,zoom:1,tx:0,ty:.12,tz:0};
    const pointers=new Map();let holdTimer=null,holdOrigin=null,world=null,placeholder=null,savedView=null,savedOverflow='',tourPosition=0,homeTour=null;
    const on=(node,type,callback,options)=>{node.addEventListener(type,callback,options);cleanups.push(()=>node.removeEventListener(type,callback,options));};
    let armResume=false;
    const knobOutput=document.createElement('output');knobOutput.className='lr-knob-output';knobOutput.hidden=true;scene.append(knobOutput);let knobTimer=0;const showKnobVolume=()=>{knobOutput.textContent=Math.round(state.volume*100)+'%';knobOutput.hidden=false;clearTimeout(knobTimer);knobTimer=setTimeout(()=>knobOutput.hidden=true,1000);};cleanups.push(()=>clearTimeout(knobTimer));
    const model=window.LuliyTurntable?.create(scene,{liftArmOnPause:standalone,parkGlassTransparent:standalone,onPlay:toggle,onClamp:standalone?toggleClamp:undefined,onSeekStart:standalone?()=>{armResume=state.playing;pause();}:undefined,onSeekEnd:standalone?()=>{if(armResume){armResume=false;play();}}:undefined,onFocus:standalone?focusDetail:undefined,onVolume:value=>{setVolume(value);if(standalone)showKnobVolume();},getVolume:()=>state.volume,onSeek:(ratio,commit)=>{const position=ratio*durationOf(current());if(commit)seek(position);else{seekInput.value=position;root.querySelector('.lr-elapsed').textContent=time(position);}},rest:root.querySelector('.lr-clamp-rest')});
    const collection=document.createElement('div');collection.className='lr-collection';
    collection.innerHTML='<button type="button" class="lr-album-trigger" aria-expanded="false" aria-haspopup="dialog"><span data-lr-copy="album">'+d.album+'</span><small data-lr-copy="albumHint">'+d.albumHint+'</small><b aria-hidden="true">+</b></button><div class="lr-album-popup" popover="auto" role="dialog"><div class="lr-album-heading"><span data-lr-copy="album">'+d.album+'</span>'+button('repeat-one','repeatOne','repeat')+'<button type="button" class="lr-album-close" data-lr-aria="closeAlbum" aria-label="'+d.closeAlbum+'">×</button></div><ol>'+tracks.map((t,i)=>t.private?'':'<li><button type="button" data-lr-album-track="'+i+'"><small>'+String(i+1).padStart(2,'0')+'</small><span>'+esc(t.name[state.lang])+'</span><small>'+durationLabel(t.duration)+'</small></button></li>').join('')+'</ol></div>';
    root.append(collection);
    const albumTrigger=collection.querySelector('.lr-album-trigger'),albumPopup=collection.querySelector('.lr-album-popup');
    if(standalone){
      albumTrigger.classList.add('lr-playlist-icon','lr-icon-button');albumTrigger.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h12M4 12h12M4 18h7M18 15l4 3-4 3z"/></svg>';albumTrigger.setAttribute('data-lr-aria','openRecords');root.querySelector('.lr-transport').append(albumTrigger);
    }
    const closeAlbum=()=>{if(albumPopup.matches(':popover-open'))albumPopup.hidePopover();};
    {
      on(albumTrigger,'click',()=>{if(albumPopup.matches(':popover-open')){closeAlbum();return;}albumPopup.showPopover();const r=albumTrigger.getBoundingClientRect(),p=albumPopup.getBoundingClientRect();albumPopup.style.left=Math.max(16,Math.min(r.left,innerWidth-p.width-16))+'px';albumPopup.style.top=Math.max(16,Math.min(r.bottom+12,innerHeight-p.height-16))+'px';focusQueueCurrent(albumPopup.querySelector('ol'));});
      on(albumPopup,'toggle',()=>albumTrigger.setAttribute('aria-expanded',String(albumPopup.matches(':popover-open'))));
    }
    on(albumPopup,'click',e=>{const track=e.target.closest('[data-lr-album-track]');if(track){mediaLibrary.play(tracks[+track.dataset.lrAlbumTrack].id,mediaLibrary.queue().map(t=>t.id));}else if(e.target.closest('.lr-album-close')){closeAlbum();albumTrigger.focus({preventScroll:true});}});
    on(albumPopup,'keydown',e=>{if(e.key==='Escape'){closeAlbum();albumTrigger.focus({preventScroll:true});return;}if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;const choices=[...albumPopup.querySelectorAll('[data-lr-album-track]')],i=choices.indexOf(document.activeElement),n=e.key==='Home'?0:e.key==='End'?choices.length-1:(i+(e.key==='ArrowDown'?1:choices.length-1))%choices.length;choices[n].focus();e.preventDefault();});
    const detailMode=()=>!!(world||homeTour?.active||root.classList.contains('lr-detail-focused'));
    const updateView=()=>{root.style.setProperty('--lr-control-clearance',(detailMode()?0:Math.max(0,(view.zoom-1)*340))+'px');deck.style.setProperty('--lr-rx',view.rx+'deg');deck.style.setProperty('--lr-rz',view.rz+'deg');deck.style.setProperty('--lr-zoom',view.zoom);model?.setView(view);};
    const resetView=()=>{root.classList.remove('lr-detail-focused');model?.setPresentation({immersive:detailMode(),rest:world?.querySelector('.lr-clamp-rest')||root.querySelector('.lr-clamp-rest')});view={rx:48,rz:-12,zoom:1,tx:0,ty:.12,tz:0};updateView();};
    const clearHold=()=>{clearTimeout(holdTimer);holdTimer=null;holdOrigin=null;};
    function closeWorld(){
      if(!world)return;const dialog=world;world=null;clearHold();
      placeholder?.replaceWith(scene);placeholder=null;scene.classList.remove('lr-dragging');drag=null;pinch=null;pointers.clear();
      model?.setPresentation({immersive:false});view={...savedView};updateView();
      dialog.close();dialog.remove();document.body.classList.remove('lr-world-open');document.body.style.overflow=savedOverflow;
      if(homeTour&&!destroyed)updateHomeTour(true);
      if(!destroyed)scene.focus({preventScroll:true});
    }
    function openWorld(){
      if(world||destroyed||homeTour?.transfer)return;clearHold();closeAlbum();savedView={...view};savedOverflow=document.body.style.overflow;
      placeholder=document.createComment('turntable position');scene.before(placeholder);
      world=document.createElement('dialog');world.className='lr-world lr-room';world.dataset.theme=state.theme;
      world.setAttribute('aria-label',state.lang==='zh'?'唱片机沉浸展示':'Turntable immersive view');
      const close=document.createElement('button');close.type='button';close.className='lr-world-close';close.textContent='×';close.setAttribute('aria-label',state.lang==='zh'?'返回页面':'Return to page');
      const worldRest=document.createElement('div');worldRest.className='lr-clamp-rest lr-world-rest';worldRest.setAttribute('aria-hidden','true');
      world.append(scene,worldRest,close);document.body.append(world);document.body.classList.add('lr-world-open');document.body.style.overflow='hidden';
      world.showModal();drag=null;pinch=null;pointers.clear();scene.classList.remove('lr-dragging');
      view={rx:48,rz:-12,zoom:1,tx:0,ty:.12,tz:0};tourPosition=0;modelViewAngle=-12;
      model?.setPresentation({immersive:true,rest:worldRest});updateView();scene.focus({preventScroll:true});
      close.addEventListener('click',closeWorld);world.addEventListener('cancel',e=>{e.preventDefault();closeWorld();});
    }
    function focusDetail(kind){
      if(!kind){resetView();return;}
      const presets={volume:{rx:43,rz:290,zoom:3.5,tx:-2.72,ty:.5,tz:1.66},arm:{rx:40,rz:38,zoom:4.2,tx:2.0,ty:1.05,tz:.8},clamp:{rx:18,rz:-25,zoom:3.1,tx:-.63,ty:.72,tz:-.26}};
      Object.assign(view,presets[kind]||presets.arm);root.classList.add('lr-detail-focused');model?.setPresentation({immersive:true,rest:world?.querySelector('.lr-clamp-rest')||(homeTour?.active?homeTour.rest:root.querySelector('.lr-clamp-rest'))});updateView();
    }
    const detailViews=[
      {rx:48,rz:-12,zoom:1,tx:0,ty:.12,tz:0},
      {rx:18,rz:-25,zoom:3.1,tx:-.79,ty:.72,tz:-.1},
      {rx:40,rz:38,zoom:4.2,tx:-.79,ty:1.2,tz:-.1},
      {rx:48,rz:150,zoom:3.7,tx:2.22,ty:1.05,tz:-1.25},
      {rx:43,rz:290,zoom:3.5,tx:-2.72,ty:.5,tz:1.66},
      {rx:112,rz:375,zoom:2.5,tx:-2.4,ty:-.6,tz:1.6},
      {rx:65,rz:480,zoom:2.1,tx:0,ty:.05,tz:-1.9},
      {rx:48,rz:708,zoom:1,tx:0,ty:.12,tz:0}
    ];
    on(scene,'wheel',event=>{
      if(standalone&&model?.wheelControl(event)){event.preventDefault();showKnobVolume();return;}
      if(!world||event.ctrlKey)return;event.preventDefault();clearHold();
      tourPosition=Math.max(0,tourPosition+clamp(event.deltaY*(event.deltaMode===1?16:1)/850,-.45,.45));
      const span=detailViews.length-1;tourPosition=Math.min(span,tourPosition);applyDetailView(tourPosition/span);
      if(tourPosition>=span&&event.deltaY>0){closeWorld();requestAnimationFrame(()=>{if(!destroyed){const top=root.querySelector('.lr-layout').getBoundingClientRect().top+scrollY+1;window.scrollTo({top,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}});}
    },{passive:false});
    let modelViewAngle=-12;
    const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
    function applyDetailView(progress){
      const step=clamp(progress,0,1)*(detailViews.length-1),i=Math.min(detailViews.length-2,Math.floor(step)),t=smooth(step-i),a=detailViews[i],b=detailViews[i+1];
      for(const key of ['rx','rz','zoom','tx','ty','tz'])view[key]=a[key]+(b[key]-a[key])*t;
      modelViewAngle=view.rz;updateView();
    }
    function endHomeTour(){
      if(!homeTour)return;cancelHomeTransfer();homeTour.active=false;scene.classList.remove('lr-tour-scene');scene.style.removeProperty('left');scene.style.removeProperty('top');scene.style.removeProperty('width');scene.style.removeProperty('height');
      homeTour.slot.hidden=true;homeTour.track.classList.remove('lr-tour-active');homeTour.stage.style.opacity='';root.style.removeProperty('--lr-tour-reveal');root.classList.remove('lr-touring');
      root.querySelector('.lr-meta').inert=false;
      document.body.classList.remove('lr-home-tour-active');document.dispatchEvent(new CustomEvent('luliy:record-tour'));model?.setPresentation({immersive:false});
    }
    function cancelHomeTransfer(){
      const transfer=homeTour?.transfer;if(!transfer)return;clearTimeout(transfer.timer);transfer.fade.cancel();homeTour.transfer=null;
    }
    function completeHomeTransfer(){
      if(!homeTour||homeTour.transfer)return;
      // Render at a stable size while fading. Only resize once, behind the fade,
      // instead of reallocating WebGL and refraction buffers on every wheel tick.
      const fade=scene.animate([{opacity:1},{opacity:0}],{duration:180,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'});
      const transfer={fade,timer:0};homeTour.transfer=transfer;
      transfer.timer=setTimeout(()=>{
        if(destroyed||!homeTour||homeTour.transfer!==transfer)return;
        const top=homeTour.track.getBoundingClientRect().bottom+scrollY+1,layout=root.querySelector('.lr-layout');
        homeTour.completed=true;
        endHomeTour();view={rx:48,rz:708,zoom:1,tx:0,ty:.12,tz:0};updateView();
        window.scrollTo({top,behavior:'instant'});
        homeTour.reveal?.cancel();homeTour.reveal=layout.animate([{opacity:0,translate:'0 8px'},{opacity:1,translate:'0 0'}],{duration:360,easing:'cubic-bezier(.19,1,.22,1)'});
      },180);
    }
    function updateHomeTour(force=false){
      if(!homeTour||destroyed||world)return;
      const tour=homeTour,r=tour.track.getBoundingClientRect(),p=clamp(-r.top/r.height,0,1),active=!matchMedia('(prefers-reduced-motion: reduce)').matches&&r.top<innerHeight&&r.bottom>0;
      if(!active){if(p>=1)tour.completed=true;if(tour.active){endHomeTour();view={rx:48,rz:708,zoom:1,tx:0,ty:.12,tz:0};updateView();}return;}
      if(tour.completed&&p>=.8){const top=r.top+scrollY+r.height*.79;window.scrollTo({top,behavior:'instant'});return;}
      if(p<.8)tour.completed=false;
      if(!tour.active){tour.reveal?.cancel();tour.active=true;tour.slot.hidden=false;scene.classList.add('lr-tour-scene');root.classList.add('lr-touring');tour.track.classList.add('lr-tour-active');}
      if(p>=.8){completeHomeTransfer();return;}
      if(tour.transfer)cancelHomeTransfer();
      const q=0,target=tour.slot.getBoundingClientRect(),top=Math.max(0,r.top);
      scene.style.left=target.left*q+'px';scene.style.top=(top*(1-q)+target.top*q)+'px';scene.style.width=(innerWidth*(1-q)+target.width*q)+'px';scene.style.height=(innerHeight*(1-q)+target.height*q)+'px';
      tour.stage.style.top=top+'px';tour.stage.style.opacity=1-q;root.style.setProperty('--lr-tour-reveal',q);
      root.querySelector('.lr-meta').inert=q<.9;
      const hideNav=r.top<=80&&q<.7;if(document.body.classList.contains('lr-home-tour-active')!==hideNav){document.body.classList.toggle('lr-home-tour-active',hideNav);document.dispatchEvent(new CustomEvent('luliy:record-tour'));}
      const blend=smooth((q-.35)/.65);model?.setPresentation({immersive:true,inlineBlend:blend,rest:q<.5?tour.rest:root.querySelector('.lr-clamp-rest')});
      if(force||Math.abs(p-tour.lastProgress)>.0001){applyDetailView(clamp(p/.8,0,1));tour.lastProgress=p;}
    }
    function attachTour(track){
      if(!track)return;if(!model){track.hidden=true;return;}const slot=document.createElement('div');slot.className='lr-scene-slot';slot.hidden=true;slot.setAttribute('aria-hidden','true');scene.before(slot);
      track.innerHTML='<div class="lr-tour-stage" aria-hidden="true"><div class="lr-clamp-rest lr-tour-rest"></div></div>';
      homeTour={track,slot,stage:track.querySelector('.lr-tour-stage'),rest:track.querySelector('.lr-tour-rest'),active:false,lastProgress:-1,frame:0};
      const schedule=()=>{if(homeTour&&!homeTour.frame)homeTour.frame=requestAnimationFrame(()=>{homeTour.frame=0;updateHomeTour();});};on(window,'scroll',schedule,{passive:true});on(window,'resize',()=>{updateHomeTour(true);});on(matchMedia('(prefers-reduced-motion: reduce)'),'change',()=>updateHomeTour(true));
      cleanups.push(()=>{cancelAnimationFrame(homeTour?.frame);homeTour?.reveal?.cancel();endHomeTour();slot.remove();track.replaceChildren();homeTour=null;});updateHomeTour(true);
    }
    on(scene,'contextmenu',event=>event.preventDefault());
    const shelfBounds=()=>{if(destroyed||standalone)return;const fits=shelf.scrollWidth<=shelf.clientWidth+2;root.querySelector('[data-lr-action="shelf-prev"]').disabled=fits;root.querySelector('[data-lr-action="shelf-next"]').disabled=fits;};
    const moveShelf=direction=>{if(standalone){extension?.browse(direction);return;}const max=shelf.scrollWidth-shelf.clientWidth;if(max<=2)return;const next=direction>0?(shelf.scrollLeft>=max-12?0:Math.min(max,shelf.scrollLeft+shelf.clientWidth*.8)):(shelf.scrollLeft<=12?max:Math.max(0,shelf.scrollLeft-shelf.clientWidth*.8));shelf.scrollTo({left:next,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
    let lastWheel=0;
    on(shelf,'wheel',event=>{if(standalone||event.ctrlKey||shelf.scrollWidth<=shelf.clientWidth+2)return;const delta=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;if(!delta)return;event.preventDefault();const now=performance.now();if(now-lastWheel<360)return;lastWheel=now;moveShelf(Math.sign(delta));},{passive:false});
    function progress() {
      if(destroyed||model?.isSeeking())return;const position=elapsed(),track=current(),empty=state.index<0;
      model?.setProgress({position:seekInput.matches(':active')?+seekInput.value:position,duration:durationOf(track)});
      if(!progressVisible)return;
      if(!seekInput.matches(':active'))seekInput.value=position;
      seekInput.max=empty?1:durationOf(track)||1;seekInput.disabled=empty||!durationOf(track);seekInput.setAttribute('aria-valuetext',time(position)+' / '+durationLabel(track.duration));
      if(!seekInput.matches(':active'))root.querySelector('.lr-elapsed').textContent=time(position);root.querySelector('.lr-duration').textContent=empty?'—:—':durationLabel(track.duration);
    }
    function updateVolume(){
      model?.setVolume(state.volume);
      const d=dictionary(),muteButton=root.querySelector('.lr-mute');
      if(muteButton.dataset.muted!==String(state.muted)){muteButton.dataset.muted=String(state.muted);muteButton.innerHTML=icon(state.muted?'mute':'volume');}
      muteButton.setAttribute('aria-label',state.muted?d.unmute:d.mute);muteButton.setAttribute('aria-pressed',String(state.muted));
      if(document.activeElement!==volumeInput)volumeInput.value=state.volume;
      root.querySelector('.lr-volume-output').textContent=Math.round(state.volume*100)+'%';
    }
    function update() {
      if(destroyed)return;const d=dictionary(),track=current(),empty=state.index<0;
      root.dataset.theme=state.theme;root.classList.toggle('lr-playing',state.playing);root.classList.toggle('lr-clamp-off',state.clampOff);root.classList.toggle('lr-resting',state.resting);root.classList.toggle('lr-ejected',empty);root.classList.toggle('lr-exchanging',!!state.exchange);root.classList.toggle('lr-ejecting',state.exchange?.kind==='eject');root.classList.toggle('lr-inserting',!!state.exchange?.fromEmpty);root.style.setProperty('--lr-exchange-duration',(state.exchange?.duration||4600)+'ms');
      model?.setState({playing:state.playing,ejected:empty,clampOff:state.clampOff,resting:state.resting,exchange:state.exchange,title:track.name.en||track.name.zh,number:Math.max(0,state.index)+1,cover:artwork(track),position:elapsed(),duration:durationOf(track),theme:state.theme});
      root.querySelectorAll('[data-lr-copy]').forEach(n=>n.textContent=d[n.dataset.lrCopy]);
      root.querySelectorAll('[data-lr-aria]').forEach(n=>{n.setAttribute('aria-label',d[n.dataset.lrAria]);if(n.tagName==='BUTTON')n.title=d[n.dataset.lrAria];});
      root.querySelector('.lr-counter').textContent=empty?'— / '+String(tracks.length).padStart(2,'0'):String(state.index+1).padStart(2,'0')+' / '+String(tracks.length).padStart(2,'0');
      root.querySelector('.lr-title').textContent=empty?d.choose:track.name[state.lang];
      
      deck.querySelector('.lr-label-title').textContent=track.name.en;deck.querySelector('.lr-label-no').textContent='LULIY / '+String(Math.max(0,state.index)+1).padStart(2,'0');
      deck.querySelector('.lr-disc-label').style.setProperty('--lr-cover-bg',track.color);
      deck.querySelector('.lr-disc-label').style.backgroundImage=artwork(track)?'url("'+artwork(track)+'")':'';
      root.querySelector('.lr-primary').innerHTML=icon(state.playing?'pause':'play')+'<span>'+esc(state.playing?d.pause:d.play)+'</span>';
      root.querySelectorAll('[data-lr-action="play"]').forEach(n=>{n.setAttribute('aria-label',state.playing?d.pause:d.play);n.setAttribute('aria-pressed',String(state.playing));});
      updateVolume();
      root.querySelector('[data-lr-action="sequence"]').setAttribute('aria-pressed',String(!state.shuffle&&!state.repeatOne));root.querySelector('[data-lr-action="shuffle"]').setAttribute('aria-pressed',String(state.shuffle&&!state.repeatOne));collection.querySelector('[data-lr-action="repeat-one"]').setAttribute('aria-pressed',String(state.repeatOne));
      root.querySelector('.lr-audio-status').textContent=state.error?d.error:state.exchange?d.changing:empty?d.empty:state.loading?d.loading:state.buffering?d.buffering:state.playing?d.playing:state.started?d.paused:d.ready;
      root.querySelectorAll('.lr-record').forEach(n=>{const i=+n.dataset.lrTrack;n.setAttribute('aria-current',String(i===state.index));n.setAttribute('aria-label',tracks[i].name[state.lang]);n.querySelector('.lr-record-name').textContent=tracks[i].name[state.lang];n.querySelector('.lr-record-info').textContent=String(i+1).padStart(2,'0')+' / '+durationLabel(tracks[i].duration);});
      shelf.setAttribute('aria-label',d.library);
      syncMusicMount(root,albumPopup);
      progress();shelfBounds();
    }
    const instance={root,update,progress,volume:updateVolume,controlsVisible:false,setModelTheme:theme=>model?.setTheme(theme),};
    mounts.add(instance);update();updateMini();
    const extension=standalone?extras?.attach(root,{on,focus:focusDetail,reset:resetView,clamp:toggleClamp,album:albumPopup}):null;cleanups.push(()=>extension?.destroy());
    on(root,'click',event=>{
      const record=event.target.closest('[data-lr-track]');
      if(record){if(suppressClick){event.preventDefault();return;}if(!standalone)select(Number(record.dataset.lrTrack));return;}
      const control=event.target.closest('[data-lr-action]');if(!control)return;
      const action=control.dataset.lrAction;
      if(action==='play')toggle();
      else if(action==='sequence')setOrder(false);else if(action==='shuffle')setOrder(true);
      else if(action==='repeat-one')setMode('repeatOne');
      else if(action==='previous')advance(-1);
      else if(action==='next')advance(1);
      else if(action==='eject')eject();
      else if(action==='mute')mute();
      else if(action==='reset')resetView();
      else if(action==='zoom-in'||action==='zoom-out'){view.zoom=clamp(view.zoom+(action==='zoom-in'?.12:-.12),.7,detailMode()?4.8:1.35);updateView();}
      else if(action==='shelf-prev'||action==='shelf-next')moveShelf(action==='shelf-next'?1:-1);
    });
    on(seekInput,'input',()=>{root.querySelector('.lr-elapsed').textContent=time(+seekInput.value);model?.setProgress({position:+seekInput.value,duration:durationOf(current())});});on(seekInput,'change',()=>seek(seekInput.value));
    on(volumeInput,'input',()=>setVolume(volumeInput.value));
    on(scene,'keydown',event=>{
      if(event.target!==scene)return;if(event.key==='Enter'){event.preventDefault();openWorld();return;}let used=true;
      if(event.key==='ArrowLeft')view.rz-=5;else if(event.key==='ArrowRight')view.rz+=5;
      else if(event.key==='ArrowUp')view.rx-=5;else if(event.key==='ArrowDown')view.rx+=5;
      else if(event.key==='+'||event.key==='=')view.zoom=clamp(view.zoom+.1,.7,detailMode()?4.8:1.35);else if(event.key==='-')view.zoom=clamp(view.zoom-.1,.7,detailMode()?4.8:1.35);
      else if(event.key==='Home')resetView();else used=false;
      if(used){event.preventDefault();modelViewAngle=view.rz;updateView();}
    });
    on(scene,'pointerdown',event=>{
      if(event.target.closest('button,a')||event.button!==0)return;
      if(model?.beginControl(event)){clearHold();scene.setPointerCapture(event.pointerId);event.preventDefault();return;}
      clearHold();holdOrigin={x:event.clientX,y:event.clientY};if(!world)holdTimer=setTimeout(openWorld,600);
      pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
      if(pointers.size===2){const p=Array.from(pointers.values());pinch={distance:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y),zoom:view.zoom};drag=null;scene.classList.add('lr-dragging');}
      else drag={id:event.pointerId,x:event.clientX,y:event.clientY,rx:view.rx,rz:view.rz,active:event.pointerType==='mouse',touch:event.pointerType!=='mouse'};
      if(event.pointerType==='mouse'){scene.setPointerCapture(event.pointerId);scene.classList.add('lr-dragging');}
    });
    on(scene,'pointermove',event=>{
      if(model?.moveControl(event)){event.preventDefault();return;}
      if(holdOrigin&&Math.hypot(event.clientX-holdOrigin.x,event.clientY-holdOrigin.y)>6)clearHold();
      if(!pointers.has(event.pointerId))return;
      pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
      if(pinch&&pointers.size===2){const p=Array.from(pointers.values());view.zoom=clamp(pinch.zoom*Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y)/Math.max(1,pinch.distance),.7,detailMode()?4.8:1.35);updateView();event.preventDefault();return;}
      if(!drag||drag.id!==event.pointerId)return;
      const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
      if(!drag.active&&((detailMode()&&Math.hypot(dx,dy)>7)||(Math.abs(dx)>7&&Math.abs(dx)>Math.abs(dy)))){drag.active=true;scene.setPointerCapture(event.pointerId);scene.classList.add('lr-dragging');}
      if(!drag.active)return;
      view.rz=drag.rz+dx*.23;view.rx=drag.rx-dy*.19;modelViewAngle=view.rz;updateView();event.preventDefault();
    });
    const endScene=event=>{const controlled=model?.endControl(event);if(!controlled&&drag&&Math.hypot(event.clientX-drag.x,event.clientY-drag.y)<4&&root.classList.contains('lr-detail-focused'))resetView();clearHold();pointers.delete(event.pointerId);if(scene.hasPointerCapture(event.pointerId))scene.releasePointerCapture(event.pointerId);if(pointers.size<2)pinch=null;drag=null;scene.classList.remove('lr-dragging');};
    on(scene,'pointerup',endScene);on(scene,'pointercancel',endScene);
    on(shelf,'keydown',event=>{
      if(standalone)return;const record=event.target.closest('.lr-record');if(!record)return;const choices=[...shelf.querySelectorAll('.lr-record:not([hidden])')];let index=choices.indexOf(record);
      if(event.key==='ArrowRight')index=Math.min(choices.length-1,index+1);else if(event.key==='ArrowLeft')index=Math.max(0,index-1);else if(event.key==='Home')index=0;else if(event.key==='End')index=choices.length-1;else return;
      event.preventDefault();const target=choices[index];if(!target)return;target.focus({preventScroll:true});
      const rect=target.getBoundingClientRect(),bounds=shelf.getBoundingClientRect();if(rect.left<bounds.left)shelf.scrollLeft-=bounds.left-rect.left+8;else if(rect.right>bounds.right)shelf.scrollLeft+=rect.right-bounds.right+8;
    });
    on(shelf,'pointerdown',event=>{if(standalone||event.pointerType!=='mouse'||event.button!==0||event.target.closest('[data-lr-track]'))return;suppressClick=false;shelfDrag={id:event.pointerId,x:event.clientX,y:event.clientY,left:shelf.scrollLeft,active:false};});
    on(shelf,'pointermove',event=>{
      if(shelfDrag&&shelfDrag.id===event.pointerId){const dx=event.clientX-shelfDrag.x,dy=event.clientY-shelfDrag.y;if(!shelfDrag.active&&Math.abs(dx)>7&&Math.abs(dx)>Math.abs(dy)){shelfDrag.active=true;suppressClick=true;shelf.setPointerCapture(event.pointerId);shelf.classList.add('lr-dragging');}if(shelfDrag.active){shelf.scrollLeft=shelfDrag.left-dx;event.preventDefault();return;}}
      if(standalone||matchMedia('(prefers-reduced-motion: reduce)').matches||event.pointerType!=='mouse')return;
      const record=event.target.closest('.lr-record');if(!record)return;const rect=record.getBoundingClientRect();record.style.setProperty('--lr-tilt-x',((event.clientX-rect.left)/rect.width-.5)*8+'deg');record.style.setProperty('--lr-tilt-y',-((event.clientY-rect.top)/rect.height-.5)*8+'deg');
    });
    const endShelf=event=>{if(!shelfDrag||shelfDrag.id!==event.pointerId)return;if(shelf.hasPointerCapture(event.pointerId))shelf.releasePointerCapture(event.pointerId);shelfDrag=null;shelf.classList.remove('lr-dragging');setTimeout(()=>{suppressClick=false;},0);};
    on(shelf,'pointerup',endShelf);on(shelf,'pointercancel',endShelf);on(shelf,'pointerleave',()=>root.querySelectorAll('.lr-record').forEach(n=>{n.style.removeProperty('--lr-tilt-x');n.style.removeProperty('--lr-tilt-y');}));
    on(shelf,'dragstart',event=>{if(!event.target.closest('[data-lr-track]'))event.preventDefault();});on(shelf,'scroll',shelfBounds,{passive:true});
    const visibility=typeof IntersectionObserver!=='undefined'?new IntersectionObserver(([entry])=>{progressVisible=instance.controlsVisible=entry.isIntersecting;if(progressVisible)progress();updateMini();},{rootMargin:'80px 0px'}):null;if(visibility)visibility.observe(root.querySelector('.lr-transport'));
    const resize=typeof ResizeObserver!=='undefined'?new ResizeObserver(shelfBounds):null;if(resize)resize.observe(shelf);else on(window,'resize',shelfBounds);
    return {attachTour,destroy(){if(destroyed)return;destroyed=true;clearHold();closeWorld();mounts.delete(instance);cleanups.forEach(fn=>fn());if(resize)resize.disconnect();if(visibility)visibility.disconnect();model?.destroy();root.remove();updateMini();},setLang,setTheme};
  }
  document.addEventListener('keydown',event=>{
    if(event.defaultPrevented||event.code!=='Space'||event.altKey||event.ctrlKey||event.metaKey||!state.started)return;
    if(event.target.closest('input,textarea,select,button,a,[contenteditable],dialog[open],[role="dialog"]')||document.querySelector('dialog[open]'))return;
    event.preventDefault();toggle();
  });
  if(typeof MutationObserver!=='undefined')new MutationObserver(()=>{
    const theme=document.documentElement.dataset.theme;
    if(theme==='light'||theme==='dark')setTheme(theme);
  }).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  extras?.configure({tracks,state,current,artwork,elapsed,time,play,pause,seek,setVolume,softStop,toggleClamp,notify});
  let sourceRetryId='';
  function setPlaybackMode(mode){state.shuffle=mode==='shuffle';state.repeatOne=mode==='repeat';shuffleHistory.length=0;savePreferences();notify();}
  const mediaLibrary={
    view:syncQueueView,focusCurrent:focusQueueCurrent,
    upsert(track){const existing=tracks.find(t=>t.id===track.id);if(existing)Object.assign(existing,track,{revoked:false});else tracks.push({...track,private:true,revoked:false,src:''});notify();return tracks.findIndex(t=>t.id===track.id);},
    play(id,queue){mediaQueue=(queue||[id]).slice();const index=tracks.findIndex(t=>t.id===id&&!t.revoked);if(index<0)return Promise.reject(Error('曲目已不可用'));return play(index,undefined,false,true);},
    rename(id,nextId,file){const track=tracks.find(t=>t.id===id);if(!track)return;track.id=nextId;track.file={...track.file,...file};if(mediaQueue)mediaQueue=mediaQueue.map(x=>x===id?nextId:x);notify();},
    revoke(ids,stop=false){for(const t of tracks)if(ids.includes(t.id)){t.revoked=true;if(t===current()&&stop)eject();}if(mediaQueue)mediaQueue=mediaQueue.filter(id=>!ids.includes(id));notify();},
    clear(){if(current()?.private)eject();for(let i=tracks.length-1;i>=0;i--)if(tracks[i].private)tracks.splice(i,1);mediaQueue=null;sourceRetryId='';notify();},
    queue(){return (mediaQueue||(state.enhanced?extras?.order()||tracks.map((_,i)=>i):tracks.map((_,i)=>i)).filter(i=>!tracks[i].private&&!tracks[i].revoked).map(i=>tracks[i].id)).map(id=>tracks.find(t=>t.id===id&&!t.revoked)).filter(Boolean).map(t=>({...t}));},
    cover(id){const index=tracks.findIndex(t=>t.id===id);return index>=0?cover(index):'';},
    revision(){return state.generation;},
    all(){return tracks.filter(t=>t.private&&!t.revoked).map(t=>({...t}));},
    get(id){return tracks.find(t=>t.id===id);},
    init(){ensureAudio();media.addEventListener('playing',()=>{const id=current().id;setTimeout(()=>{if(current().id===id&&state.playing)sourceRetryId='';},15000)});media.addEventListener('error',()=>{const t=current();if(t.resolveSource&&state.started&&sourceRetryId!==t.id){sourceRetryId=t.id;const position=state.position;t.src='';play(state.index,position,false,true);} });}
  };
// Views receive one stable queue snapshot; they never rebuild on every audio tick.
function syncQueueView(container){const queue=mediaLibrary.queue(),fingerprint=state.lang+JSON.stringify(queue.map(t=>[t.id,t.name,t.file?.creator,t.cover]));if(container._queueFingerprint!==fingerprint){const focused=container.querySelector(':focus')?.dataset.queueId,scroll=container.scrollTop;container._queueFingerprint=fingerprint;container.replaceChildren();for(const t of queue){const row=document.createElement(container.tagName==='OL'?'li':'div'),b=document.createElement('button');b.type='button';b.className='lm-queue-track';b.dataset.queueId=t.id;const i=tracks.findIndex(x=>x.id===t.id);b.dataset.lrAlbumTrack=i;b.innerHTML='<span class="lm-queue-cover">'+cover(i)+'</span><span class="lm-queue-copy"><strong>'+esc(t.name[state.lang]||t.name.zh)+'</strong><small class="lm-queue-artist">'+esc(t.file?.creator||t.artist||'')+'</small></span><small class="lm-queue-state"></small>';b.onclick=e=>{e.stopPropagation();mediaLibrary.play(t.id,mediaLibrary.queue().map(x=>x.id));};row.append(b);container.append(row);}container.scrollTop=scroll;if(focused)[...container.querySelectorAll('[data-queue-id]')].find(b=>b.dataset.queueId===focused)?.focus({preventScroll:true});}for(const b of container.querySelectorAll('[data-queue-id]')){const active=state.index>=0&&b.dataset.queueId===current().id;b.setAttribute('aria-current',String(active));b.querySelector('.lm-queue-state').textContent=active?(state.error?'!':state.playing?'Ⅱ':'▶'):'';b.setAttribute('aria-label',b.querySelector('strong').textContent+(active?(state.lang==='en'?(state.playing?' · Playing':' · Paused'):state.lang==='ja'?(state.playing?' · 再生中':' · 一時停止'):(state.playing?' · 正在播放':' · 已暫停')):''));}}
function syncMusicMount(root,albumPopup){const queue=mediaLibrary.queue(),currentId=state.index<0?'':current().id,pos=queue.findIndex(t=>t.id===currentId);root.querySelector('.lr-counter').textContent=(pos<0?'—':String(pos+1).padStart(2,'0'))+' / '+String(queue.length).padStart(2,'0');root.querySelectorAll('[data-lr-copy="album"]').forEach(n=>n.textContent=state.lang==='en'?'Now playing queue':state.lang==='ja'?'再生キュー':'目前播放列表');albumPopup.setAttribute('aria-label',state.lang==='en'?'Now playing queue':'目前播放列表');syncQueueView(albumPopup.querySelector('ol'));if(root.classList.contains('lr-home')){const shelf=root.querySelector('.lr-shelf');for(const card of [...shelf.querySelectorAll('[data-private-record]')])if(!tracks[+card.dataset.lrTrack]?.private||tracks[+card.dataset.lrTrack]?.revoked)card.remove();for(let i=0;i<tracks.length;i++){const t=tracks[i];if(!t.private||t.revoked)continue;let card=shelf.querySelector('[data-lr-track="'+i+'"]');if(!card){card=document.createElement('button');card.type='button';card.className='lr-record';card.dataset.lrTrack=i;card.dataset.privateRecord='true';shelf.append(card);}const markup=cover(i)+'<span class="lr-record-name">'+esc(t.name[state.lang])+'</span><span class="lr-record-info">Drive</span>';if(card.innerHTML!==markup)card.innerHTML=markup;card.setAttribute('aria-current',String(i===state.index));card.setAttribute('aria-label',t.name[state.lang]);}}}
function focusQueueCurrent(container){const current=container.querySelector('[aria-current="true"]')||container.querySelector('[data-queue-id]');current?.scrollIntoView({block:'nearest'});current?.focus({preventScroll:true});}

  mediaLibrary.init();

  window.LuliyRecords={mediaLibrary,mode:setPlaybackMode,audio:()=>media,refresh:notify,mount,pause,setLang,setTheme,play,select,eject,toggle,advance,seek,setVolume,setListeningGain,toggleClamp,subscribe,getState:snapshot,tracks:()=>tracks.map(track=>({...track,name:{...track.name},cover:artwork(track)})),artwork:index=>artwork(tracks[Number.isInteger(index)?index:Math.max(0,state.index)]||current())};
})();

