//import pinata from 'url:@test/nested/pinata';

import { greeting2 } from '@test/';
import { greeting3 } from '@test/nested/index';

console.log(greeting2);
console.log(greeting3);

document.getElementById( 'g1' ).innerHTML = greeting2;
document.getElementById( 'g2' ).innerHTML = greeting3;
//document.getElementById( 'image' )['src'] = pinata;