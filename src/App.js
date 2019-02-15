import React, { Component, Fragment } from 'react';
import Header from './components/Header';
import Menu from './components/Menu';
import NewCall from './components/NewCall';
import CallHistory from './components/CallHistory';
import { getData } from './services/getData';
import { getList } from './services/getList';
import './styles/App.scss';
import KEYS from './config';
import { Route, Switch } from 'react-router-dom';
import Modal from './components/Modal';
import * as moment from 'moment';


class App extends Component {

  constructor(props){
    super(props);

    this.selectPersonRequested = React.createRef();
    this.allList = [];

    this.state= {
      info: {
        addedBy: "",
        personRequested:"",
        name: "",
        company:"",
        position:"",
        otherInfo:"",
        email:"",
        telephone: 0,
        action:"",
        message:"",
      },
      errorIncomingData:"hidden",
      errorCallAction: "hidden",
      errorPerson: "hidden",
      succesMessage: "hidden",
      errorMessage: "hidden",
      callAgainClass: "",
      callBackClass: "",
      redialCheck: false,
      callBackCheck: false,

      //CALLHISTORY COMPONENT STATES

      results: [],
      startDate: "",
      endDate: ""


  }

    this.getWhoCalls = this.getWhoCalls.bind(this);
    this.getRequestedEmployee = this.getRequestedEmployee.bind(this);
    this.getName = this.getName.bind(this);
    this.getCompany = this.getCompany.bind(this);
    this.getPosition = this.getPosition.bind(this);
    this.getOtherInfo = this.getOtherInfo.bind(this);
    this.getEmail = this.getEmail.bind(this);
    this.getPhone = this.getPhone.bind(this);
    this.getCallAction = this.getCallAction.bind(this);
    this.getMessage = this.getMessage.bind(this);
    this.sendInfo = this.sendInfo.bind(this);
    this.isEmptyOrNot = this.isEmptyOrNot.bind(this);
    this.sendForm = this.sendForm.bind(this);
    this.deselectOption = this.deselectOption.bind(this);
    this.showList = this.showList.bind(this);
    this.getStartDate =  this.getStartDate.bind(this);
    this.getEndDate =  this.getEndDate.bind(this);
    this.filterDate = this.filterDate.bind(this);

  }

  getWhoCalls(event) {
    const { info } = this.state;
    const newInfo = { ...info, addedBy: event.currentTarget.value };
    this.setState({ info: newInfo });
  }

  getRequestedEmployee(event) {
    const { info } = this.state;
    const newInfo = { ...info, personRequested: event.currentTarget.value };
    this.setState({ info: newInfo });
  }

  getName(event) {
    const { info } = this.state;
    const newInfo = { ...info, name: event.currentTarget.value };
    this.setState({ info: newInfo });
  }

  getCompany(event) {
    const { info } = this.state;
    const newInfo = { ...info, company: event.currentTarget.value };
    this.setState({ info: newInfo });
  }

  getPosition(event) {
    const { info } = this.state;
    const newInfo = { ...info, position: event.currentTarget.value };
    this.setState({ info: newInfo });
  }

  getOtherInfo(event) {
    const { info } = this.state;
    const newInfo = { ...info, otherInfo: event.currentTarget.value };
    this.setState({ info: newInfo });
  }

  getEmail(event) {
    const { info } = this.state;
    const newInfo = { ...info, email: event.currentTarget.value };
    this.setState({ info: newInfo });
  }

  getPhone(event) {
    const { info } = this.state;
    const newInfo = { ...info, telephone: event.currentTarget.value };
    this.setState({ info: newInfo });
  }

  getCallAction(event) {
    const { info } = this.state;
    const newInfo = { ...info, action: event.currentTarget.value };
    let state = {
      info: newInfo,
      callAgainClass: '',
      callBackClass: '',
      redialCheck:false,
      callBackCheck:false
    };

  if (event.currentTarget.id === 'redial'){
     if(!this.state.redialCheck) {
      state = {
      info: newInfo,
      callAgainClass: 'selectedClass',
      callBackClass: '',
      redialCheck:true,
      callBackCheck:false
      };
    }

  }else {
    if (!this.state.callBackCheck){
      state = {
        info: newInfo,
        callAgainClass: '',
        callBackClass: 'selectedClass',
        redialCheck:false,
        callBackCheck:true

      };
    }
  }
  this.setState(state);
}


  getMessage(event) {
    const { info } = this.state;
    const newInfo = { ...info, message: event.currentTarget.value };
    this.setState({ info: newInfo });
  }

  preventSubmission(event) {

    event.preventDefault();
  }



  sendInfo() {

      const info = this.state.info;
      getData(info)
        .then(response => console.log('Success:', JSON.stringify(response)))
        .then(this.setState({
           succesMessage:""}))
        .catch(error => console.error('Error:', error));
  }

  sendForm(event){
    event.preventDefault();
    this.isEmptyOrNot();

  }

  isEmptyOrNot(){
    const incomingInfo = this.state.info;

      if (incomingInfo.personRequested === ""){
        this.setState({
          errorPerson: ""
        });

      } else if (incomingInfo.name === "" && incomingInfo.company === "" && incomingInfo.position === "" && incomingInfo.telephone === 0 && incomingInfo.email === "" && incomingInfo.otherInfo === ""){
      this.setState({
        errorIncomingData: "",
        errorPerson: "hidden"
      });

      } else if (incomingInfo.message === ""){

      this.setState({
        errorIncomingData: "hidden",
        errorCallAction:"",
        errorPerson: "hidden",
        errorMessage:""

      });


    } else {
      this.setState({
        errorIncomingData: "hidden",
        errorCallAction:"hidden",
        errorPerson: "hidden",
        errorMessage:"hidden"
      });

      this.sendInfo();
      this.sendSlackInfo();
    }
  }



  deselectOption(){

    const addedBy= this.state.info.addedBy;

    if(addedBy!==""){
      const optionsArray= this.selectPersonRequested.current.getElementsByTagName("option");

      for(let i=0; i<optionsArray.length; i++){

        if(optionsArray[i].label.includes(addedBy)){
          optionsArray[i].disabled = true;
          optionsArray[i].style.display="none";
        }else{
          optionsArray[i].disabled = false;
          optionsArray[i].style.display="block";
        }

      }

    }

  }


  makeMessage(){
    const {name, position, company, otherInfo, email, telephone, action, message} = this.props;

    let displayedMessage=`${this.state.info.personRequested}, te acaban de llamar y te han dejado el *siguiente mensaje*: \n${this.state.info.action} \n${this.state.info.message}`;

    if ((name!==''|| position!=='' || company!=='' || otherInfo!==''|| email!=='' )&&telephone===0){
      return displayedMessage=  `${this.state.info.personRequested}, *te acaba de llamar*: \n
      ${name} \n${position} \n${company}  \n${email} \n${otherInfo} \n *Su mensaje ha sido* \n${action} \n${message}`;
    }
      else if (name!==''|| position!=='' || company!=='' || otherInfo!==''|| email!=='' || telephone!==0){
      return displayedMessage=  `${this.state.info.personRequested}, *te acaba de llamar*: \n
      ${name} \n${position} \n${company} \n${telephone} \n${email} \n${otherInfo} \n *Su mensaje ha sido* \n${action} \n${message}`;

    }else{

      return displayedMessage;
    }
  }

  sendSlackInfo(){

    const message = this.makeMessage();
    const key = KEYS.SLACK_KEY;

    const settings = {
      url: `https://slack.com/api/chat.postMessage?token=${key}&channel=%23your-calls-app&text=${message}&pretty=1`,
      method: 'POST',
      body: {}
    }

    fetch(settings.url, {
      method: settings.method,
      body: JSON.stringify(settings.body),
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .then(response => console.log('Success:', JSON.stringify(response)))
    .catch(error => console.error('Error:', error));
  }

  showList() {
    getList()
    .then(results => {
                this.setState({
                  results: results
                })
                this.allList = results;
  })};

  // FUNCTIONS FOR THE FILTER


  getStartDate(e) {
    const userQuery = e.currentTarget.value;
    this.setState({
      startDate: userQuery
    });
  }


  getEndDate(e) {
    const userQuery = e.currentTarget.value;
    this.setState({
      endDate: userQuery
    });
  }

  filterDate(){

    const results = this.state.results;
    const startDate= this.state.startDate;
    const endDate = this.state.endDate;
    const formatDate = 'DD/MM/YYYY';

    //Convertimos la fecha de entrada en una fecha de moment "1995-12-25"
    const momentStartDate = moment(startDate, formatDate);
    const momentEndDate = moment(endDate, formatDate);

    //recorremos el array y filtramos
    // const filteredResults = results.filter(item =>
    //   moment(item).isBetween(momentStartDate, momentEndDate)
    // );
    const filteredResults = this.allList.filter(item =>{

      const callDate = moment(item.loggedAt, 'YYYY-MM-DD');
      //Aplicamos el metodo isBetween de la libreria Moment: https://momentjs.com/docs/#/query/is-between/
      // const moment2 = moment;
      // debugger
      return callDate.isBetween(momentStartDate, momentEndDate) || callDate.isSame(momentEndDate) || callDate.isSame(momentStartDate); //true o false

    });

    // this.setState(preState => {
    //   return {
    //     results: filteredResults
    //   }
    // });

    this.setState({
      results: filteredResults
    });

    return filteredResults;
  }


  render() {
    const {errorPerson, errorIncomingData,errorCallAction, errorMessage, callBackClass, callAgainClass, redialCheck, callBackCheck} = this.state;
    const {preventSubmission, getWhoCalls, getRequestedEmployee, getName, getCompany, getPosition, getOtherInfo, getEmail, getPhone, getCallAction, getMessage, sendForm, deselectOption, selectPersonRequested } = this;
    return (
      <div className="App">
        <Header />
          <main className="main">
            <div className="form__wrapper">
              <Menu/>
                <Switch>
                  <Fragment>
                    <Route exact path="/" render={()=>(
                        <NewCall preventSubmission={preventSubmission} getWhoCalls={getWhoCalls} errorPerson={errorPerson} getRequestedEmployee ={getRequestedEmployee} errorIncomingData={errorIncomingData} getName={getName} getCompany={getCompany} getPosition={getPosition} getOtherInfo={getOtherInfo} getEmail={getEmail} getPhone={getPhone} errorCallAction={errorCallAction} getCallAction={getCallAction} getMessage={getMessage} errorMessage={errorMessage} sendForm={sendForm} deselectOption={deselectOption} selectPersonRequested ={selectPersonRequested} callBackClass={callBackClass} callAgainClass={callAgainClass} redialCheck={redialCheck} callBackCheck={callBackCheck}
                        />
                        )}/>
                    <Route path="/callHistory" render={()=>(<CallHistory actionShowList={this.showList} results={this.state.results} actionGetStartDate= {this.getStartDate} actionGetEndDate= {this.getEndDate} actionFilterDate={this.filterDate}/>)}/>
                  </Fragment>
                </Switch>
             </div>
             <Route exact path="/" render={()=>(
                <Modal sucess={this.state.succesMessage} personRequested={this.state.info.personRequested}  /> )}/>
          </main>
      </div>
    );
  }
}

export default App;
