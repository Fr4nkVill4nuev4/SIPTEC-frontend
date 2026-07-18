var state = {
  view: "dashboard",
  query: "",
  currentLoan: null,
  currentUser: null,
  token: null,
  apiStatus: "Conectando con la base de datos...",
  items: [],
  loans: [],
  returns: [],
  users: [],
  history: [],
  reports: [],
  reportTab: "history",
  viewedReport: null,
};

var root = document.querySelector("#viewRoot");
var loginScreen = document.querySelector("#loginScreen");
