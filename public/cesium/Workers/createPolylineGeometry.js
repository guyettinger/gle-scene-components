/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.121.1
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import{a as m}from"./chunk-WZGN4MSQ.js";import{a as N}from"./chunk-6HNWIIPM.js";import{a as U}from"./chunk-NMH5EFPB.js";import"./chunk-5NTDCBC7.js";import{a as k}from"./chunk-DGE7Y2WF.js";import{a as le}from"./chunk-I4OYGRA6.js";import"./chunk-AKQNEP7V.js";import"./chunk-N6FZVG54.js";import"./chunk-GVIXCH3T.js";import{a as se}from"./chunk-YKIFKUHX.js";import{a as ce}from"./chunk-T5AOQBYV.js";import{a as ne,b as re,c as ie,d as O}from"./chunk-2IMMJQM5.js";import{d as oe}from"./chunk-DFXB7SZL.js";import"./chunk-OYLSJJLX.js";import{a as x}from"./chunk-BOISCMIO.js";import{a as p,d as u}from"./chunk-HKHWYVWA.js";import{a as J}from"./chunk-HJACR6CT.js";import"./chunk-L3ZF6YQH.js";import"./chunk-IHT3NRUE.js";import{a as A}from"./chunk-XK5OJOFF.js";import{a as V}from"./chunk-YLNT2FRE.js";import{e as h}from"./chunk-PIOASIZ6.js";var me=[];function Ae(e,o,t,n,c){let s=me;s.length=c;let l,E=t.red,a=t.green,r=t.blue,w=t.alpha,b=n.red,i=n.green,f=n.blue,L=n.alpha;if(m.equals(t,n)){for(l=0;l<c;l++)s[l]=m.clone(t);return s}let M=(b-E)/c,z=(i-a)/c,H=(f-r)/c,B=(L-w)/c;for(l=0;l<c;l++)s[l]=new m(E+l*M,a+l*z,r+l*H,w+l*B);return s}function G(e){e=A(e,A.EMPTY_OBJECT);let o=e.positions,t=e.colors,n=A(e.width,1),c=A(e.colorsPerVertex,!1);if(!h(o)||o.length<2)throw new V("At least two positions are required.");if(typeof n!="number")throw new V("width must be a number");if(h(t)&&(c&&t.length<o.length||!c&&t.length<o.length-1))throw new V("colors has an invalid length.");this._positions=o,this._colors=t,this._width=n,this._colorsPerVertex=c,this._vertexFormat=k.clone(A(e.vertexFormat,k.DEFAULT)),this._arcType=A(e.arcType,N.GEODESIC),this._granularity=A(e.granularity,J.RADIANS_PER_DEGREE),this._ellipsoid=u.clone(A(e.ellipsoid,u.default)),this._workerName="createPolylineGeometry";let s=1+o.length*p.packedLength;s+=h(t)?1+t.length*m.packedLength:1,this.packedLength=s+u.packedLength+k.packedLength+4}G.pack=function(e,o,t){if(!h(e))throw new V("value is required");if(!h(o))throw new V("array is required");t=A(t,0);let n,c=e._positions,s=c.length;for(o[t++]=s,n=0;n<s;++n,t+=p.packedLength)p.pack(c[n],o,t);let l=e._colors;for(s=h(l)?l.length:0,o[t++]=s,n=0;n<s;++n,t+=m.packedLength)m.pack(l[n],o,t);return u.pack(e._ellipsoid,o,t),t+=u.packedLength,k.pack(e._vertexFormat,o,t),t+=k.packedLength,o[t++]=e._width,o[t++]=e._colorsPerVertex?1:0,o[t++]=e._arcType,o[t]=e._granularity,o};var de=u.clone(u.UNIT_SPHERE),ue=new k,S={positions:void 0,colors:void 0,ellipsoid:de,vertexFormat:ue,width:void 0,colorsPerVertex:void 0,arcType:void 0,granularity:void 0};G.unpack=function(e,o,t){if(!h(e))throw new V("array is required");o=A(o,0);let n,c=e[o++],s=new Array(c);for(n=0;n<c;++n,o+=p.packedLength)s[n]=p.unpack(e,o);c=e[o++];let l=c>0?new Array(c):void 0;for(n=0;n<c;++n,o+=m.packedLength)l[n]=m.unpack(e,o);let E=u.unpack(e,o,de);o+=u.packedLength;let a=k.unpack(e,o,ue);o+=k.packedLength;let r=e[o++],w=e[o++]===1,b=e[o++],i=e[o];return h(t)?(t._positions=s,t._colors=l,t._ellipsoid=u.clone(E,t._ellipsoid),t._vertexFormat=k.clone(a,t._vertexFormat),t._width=r,t._colorsPerVertex=w,t._arcType=b,t._granularity=i,t):(S.positions=s,S.colors=l,S.width=r,S.colorsPerVertex=w,S.arcType=b,S.granularity=i,new G(S))};var pe=new p,ae=new p,fe=new p,he=new p;G.createGeometry=function(e){let o=e._width,t=e._vertexFormat,n=e._colors,c=e._colorsPerVertex,s=e._arcType,l=e._granularity,E=e._ellipsoid,a,r,w,b=[],i=le(e._positions,p.equalsEpsilon,!1,b);if(h(n)&&b.length>0){let d=0,P=b[0];n=n.filter(function(q,T){let g=!1;return c?g=T===P||T===0&&P===1:g=T+1===P,g?(d++,P=b[d],!1):!0})}let f=i.length;if(f<2||o<=0)return;if(s===N.GEODESIC||s===N.RHUMB){let d,P;s===N.GEODESIC?(d=J.chordLength(l,E.maximumRadius),P=U.numberOfPoints):(d=l,P=U.numberOfPointsRhumbLine);let q=U.extractHeights(i,E);if(h(n)){let T=1;for(a=0;a<f-1;++a)T+=P(i[a],i[a+1],d);let g=new Array(T),D=0;for(a=0;a<f-1;++a){let Z=i[a],$=i[a+1],I=n[a],ee=P(Z,$,d);if(c&&a<T){let _e=n[a+1],te=Ae(Z,$,I,_e,ee),Pe=te.length;for(r=0;r<Pe;++r)g[D++]=te[r]}else for(r=0;r<ee;++r)g[D++]=m.clone(I)}g[D]=m.clone(n[n.length-1]),n=g,me.length=0}s===N.GEODESIC?i=U.generateCartesianArc({positions:i,minDistance:d,ellipsoid:E,height:q}):i=U.generateCartesianRhumbArc({positions:i,granularity:d,ellipsoid:E,height:q})}f=i.length;let L=f*4-4,M=new Float64Array(L*3),z=new Float64Array(L*3),H=new Float64Array(L*3),B=new Float32Array(L*2),K=t.st?new Float32Array(L*2):void 0,y=h(n)?new Uint8Array(L*4):void 0,W=0,j=0,X=0,Y=0,_;for(r=0;r<f;++r){r===0?(_=pe,p.subtract(i[0],i[1],_),p.add(i[0],_,_)):_=i[r-1],p.clone(_,fe),p.clone(i[r],ae),r===f-1?(_=pe,p.subtract(i[f-1],i[f-2],_),p.add(i[f-1],_,_)):_=i[r+1],p.clone(_,he);let d,P;h(y)&&(r!==0&&!c?d=n[r-1]:d=n[r],r!==f-1&&(P=n[r]));let q=r===0?2:0,T=r===f-1?2:4;for(w=q;w<T;++w){p.pack(ae,M,W),p.pack(fe,z,W),p.pack(he,H,W),W+=3;let g=w-2<0?-1:1;if(B[j++]=2*(w%2)-1,B[j++]=g*o,t.st&&(K[X++]=r/(f-1),K[X++]=Math.max(B[j-2],0)),h(y)){let D=w<2?d:P;y[Y++]=m.floatToByte(D.red),y[Y++]=m.floatToByte(D.green),y[Y++]=m.floatToByte(D.blue),y[Y++]=m.floatToByte(D.alpha)}}}let v=new ce;v.position=new O({componentDatatype:x.DOUBLE,componentsPerAttribute:3,values:M}),v.prevPosition=new O({componentDatatype:x.DOUBLE,componentsPerAttribute:3,values:z}),v.nextPosition=new O({componentDatatype:x.DOUBLE,componentsPerAttribute:3,values:H}),v.expandAndWidth=new O({componentDatatype:x.FLOAT,componentsPerAttribute:2,values:B}),t.st&&(v.st=new O({componentDatatype:x.FLOAT,componentsPerAttribute:2,values:K})),h(y)&&(v.color=new O({componentDatatype:x.UNSIGNED_BYTE,componentsPerAttribute:4,values:y,normalize:!0}));let C=se.createTypedArray(L,f*6-6),F=0,R=0,we=f-1;for(r=0;r<we;++r)C[R++]=F,C[R++]=F+2,C[R++]=F+1,C[R++]=F+1,C[R++]=F+2,C[R++]=F+3,F+=4;return new ie({attributes:v,indices:C,primitiveType:re.TRIANGLES,boundingSphere:oe.fromPoints(i),geometryType:ne.POLYLINES})};var Q=G;function ge(e,o){return h(o)&&(e=Q.unpack(e,o)),e._ellipsoid=u.clone(e._ellipsoid),Q.createGeometry(e)}var We=ge;export{We as default};
