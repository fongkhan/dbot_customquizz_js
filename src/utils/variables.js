const { table_example } = require("./example");

const lastActivityTimestamp = {
  _lastact: null,
  _interval: 1800000,
  get lastact() {
    return this._lastact;
  },
  set lastact(newlastact) {
    this._lastact = newlastact;
  },
  get interval() {
    return this._interval;
  },
  set interval(newInterval) {
    this._interval = newInterval;
  },
};

const command_names = {
  _names: null,
  get names() {
    return this._names;
  },
  set names(newNames) {
    this._names = newNames;
  },
};

// set getter and setter of a table for the quizz
const quizz = {
	_name: null,
	_table: table_example,
	get name() {
		return this._name;
	},
	set name(newName) {
		this._name = newName;
	},
	get table() {
		return this._table;
	},
	set table(newTable) {
		this._table = newTable;
	}
};


module.exports = {
  lastActivityTimestamp,
  command_names,
  quizz,
};