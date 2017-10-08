'use strict';
exports.isStar = true;

var phoneBook = [];
exports.add = function (phone, name, email) {
    if (isValidName(name) && isValidPhone(phone) &&
        arguments.length > 1 &&
        String(phoneBook).indexOf(String(phone)) === -1
    ) {
        if (email === undefined) {
            phoneBook.push([phone, name]);

        } else {
            phoneBook.push([phone, name, email]);
        }

        return true;
    }

    return false;
};

exports.update = function (phone, name, email) {
    var change = false;
    phoneBook.forEach((contact, index) => {
        if (contact[0] === phone) {

            if (name === undefined || name === '') {
                name = contact[1];
            }
            if (email === undefined || name === '') {
                phoneBook[index] = [phone, name];
            } else {
                phoneBook[index] = [phone, name, email];
            }
            change = true;
        }
    });

    return change;
};

exports.find = function (query) {
    var findContacts = [];
    if (query === '*') {
        findContacts = phoneBook.slice();

    } else {

        phoneBook.forEach(contact => {

            if (String(contact).toLowerCase()
                .indexOf(query.toLowerCase()) !== -1) {

                findContacts.push(contact);
            }
        });
    }
    findContacts.forEach((contact, index) => {
        if (contact[2] === undefined) {
            findContacts[index] = [contact[1], formatPhone(contact[0])];
        } else {
            findContacts[index] = [contact[1], formatPhone(contact[0]), contact[2]];
        }
    });

    findContacts.sort((a, b) => {
        return a[0] > b[0];
    });
    var result = [];

    findContacts.forEach(contact => {
        result.push(contact.join(', '));

    });

    return result;
};


exports.findAndRemove = function (query) {
    var count = 0;
    if (query === '*') {
        count = phoneBook.length;
        phoneBook = [];

        return count;
    }
    phoneBook.forEach((contact, index) => {
        if (String(contact).toLowerCase()
            .indexOf(query.toLowerCase()) !== -1) {
            count++;
            phoneBook.slice(index, 1);
        }
    });

    return count;
};

exports.importFromCsv = function (csv) {
    var count = 0;
    csv.split('\n').forEach(contact => {
        let arrNewContact = contact.split(';');
        if (exports.find(arrNewContact[1]).length > 0) {
            if (exports.update(arrNewContact[1], arrNewContact[0], arrNewContact[2]) ||
                exports.add(arrNewContact[1], arrNewContact[0], arrNewContact[2])) {
                count++;
            }
        }
    });

    return count;
};

function isValidPhone(phone) {
    if (String(Number(phone)) === String(phone) && phone.length === 10) {
        return true;
    }

    return false;
}

function isValidName(name) {
    if (name === 'Неизвестный') {
        return false;
    }

    return true;
}

function formatPhone(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' +
        phone.slice(3, 6) + '-' +
        phone.slice(6, 8) + '-' +
        phone.slice(8, 10);
}

