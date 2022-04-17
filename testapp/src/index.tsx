import React from 'react';
import { render } from 'react-dom';
import { A, B, HelloWorld } from '@d/dfile';

console.log(A);
console.log(B);
render(<HelloWorld />, document.getElementById('root'));
