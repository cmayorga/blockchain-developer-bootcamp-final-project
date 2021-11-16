import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Select,
  MenuItem,
  FormControl
} from '@material-ui/core';
import {
  Link
} from "react-router-dom";
import { withNamespaces } from 'react-i18next';
import i18n from '../../i18n';
import { colors } from '../../theme'

import Store from "../../stores";
const store = Store.store

const styles = theme => ({
  footer: {
    //position: 'absolute',
    marginBottom: "-30px",
    top: '0px',
    padding: '24px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center',
    }
  },
  footerLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '100%'
  },
  webName: {    
    fontFamily: 'ReklameScript',
    fontSize: '60px',
    marginTop: '-50px',
    color: '#ff5ef7',
    textShadow: '2px 2px #ff0000',
  },  
  footerText: {
    cursor: 'pointer'
  },
  languageContainer: {
    paddingLeft: '12px',
    display: 'none'
  },
  selectInput: {
    fontSize: '14px',
    color: colors.pink
  },
  link: {
    textDecoration: 'none',
    marginRight: "20px",
  }
});


class Footer extends Component {

  constructor(props) {
    super()

    this.state = {
      languages: store.getStore('languages'),
      language: 'en',
    }
  }

  render() {
    const { classes, t, location } = this.props;
    const {
    } = this.state

    return (
      <div className={classes.footer}>
        <div className={classes.footerLinks}>
          {/*<img alt="https://consensys-cmayorga-project.herokuapp.com/" src="/icon.png" height="40" style={{paddingBottom: "0px"}} />&nbsp;*/}
          <Link to={"/"} className={ classes.link }>            
            &nbsp;
            <Typography className={ classes.webName } variant={ 'h6'}>              
              CONS finance
            </Typography>            
          </Link> 
          {/*
          <Link to={"/staking"} className={ classes.link }>
            <Typography className={ classes.footerText } variant={ 'h6'}>
              Stake
            </Typography>
          </Link>
          */}
        </div>
      </div>
    )
  }
}

export default withNamespaces()(withRouter(withStyles(styles)(Footer)));
