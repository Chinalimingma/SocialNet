// spec/fakes/region.js

'use strict';
class FakeRegion {
    //render the view that is passed to it
    show(view) {
        view.render();
    }
}
module.exports = FakeRegion;