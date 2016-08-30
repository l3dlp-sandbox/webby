'use strict';

var utilities = {};

utilities.copyArray = function(source) {
    return [].slice.call(source, 0);
};

utilities.mergeObjects = function() {
    var destination = null;

    utilities.copyArray(arguments).forEach(function(source) {
        if (destination === null) destination = source || {};
        else if (source) {
            for (var item in source) {
                var found = item in destination;

                if (found && Array.isArray(destination[item]))
                    destination[item] = destination[item].concat(source[item]);
                else if (found && typeof destination[item] === 'object')
                    destination[item] = utilities.mergeObjects(destination[item], source[item]);
                else
                    destination[item] = source[item];
            }
        }
    });

    return destination;
};

module.exports = utilities;
