import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import UNIlogo from '../../assets/uniswap.png';
import {
  Typography,
  Button,
  Card,
  TextField,
  InputAdornment
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';

import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

import Loader from '../loader'
import Snackbar from '../snackbar'

import Store from "../../stores";
import { colors } from '../../theme'

import {
  ERROR,
  CONFIGURE_RETURNED,
  STAKE,
  STAKE_RETURNED,
  WITHDRAW,
  WITHDRAW_RETURNED,
  GET_REWARDS,
  GET_REWARDS_RETURNED,
  GET_REWARDS_AVAILABLE,
  EXIT,
  EXIT_RETURNED,
  GET_YCRV_REQUIREMENTS,
  GET_YCRV_REQUIREMENTS_RETURNED,
  GET_GOVERNANCE_REQUIREMENTS,
  GET_GOVERNANCE_REQUIREMENTS_RETURNED,
  GET_BALANCES_RETURNED,
  GET_BALANCES
} from '../../constants'

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '900px',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '40px'
  },
  intro: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  introCenter: {
    minWidth: '100%',
    textAlign: 'center',
    padding: '48px 0px'
  },
  investedContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    minWidth: '100%',
    [theme.breakpoints.up('md')]: {
      minWidth: '800px',
    }
  },
  connectContainer: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '450px',
    [theme.breakpoints.up('md')]: {
      width: '450',
    }
  },
  disaclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    marginBottom: '24px',
  },
  addressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    textOverflow: 'ellipsis',
    cursor: 'pointer',
    padding: '14px 15px',
    borderRadius: '50px',
    border: '1px solid ' + colors.borderBlue,
    alignItems: 'center',
    maxWidth: '500px',
    float: 'right',
    position: 'absolute',
    right: '15px',
    top: '15px',
  },
  walletAddress: {
    padding: '0px 12px'
  },
  walletTitle: {
    flex: 1,
    color: colors.darkGray
  },
  overview: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    alignItems: 'center',
    marginTop: '40px',
    width: '100%',
    background: colors.white
  },
  overviewField: {
    display: 'flex',
    flexDirection: 'column'
  },
  overviewTitle: {
    color: colors.darkGray
  },
  overviewValue: {
      textAlign: 'center',
  },
  actions: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '900px',
    flexWrap: 'wrap',
    background: colors.white,
    border: '1px solid '+colors.borderBlue,
    padding: '28px 30px',
    borderRadius: '50px',
    marginTop: '40px'
  },
  actionContainer: {
    minWidth: 'calc(50% - 40px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px'
  },
  primaryButton: {
    '&:hover': {
      backgroundColor: "#2F80ED",
    },
    padding: '20px 32px',
    backgroundColor: "#2F80ED",
    borderRadius: '50px',
    fontWeight: 500,
  },
  actionButton: {
    padding: '20px 32px',
    borderRadius: '50px',
  },
  buttonText: {
    fontWeight: '700',
  },
  stakeButtonText: {
    fontWeight: '700',
    color: 'white',
  },
  valContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem'
  },
  inputAdornment: {
    fontWeight: '600',
    fontSize: '1.5rem'
  },
  assetIcon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    borderRadius: '25px',
    background: '#dedede',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    marginRight: '16px'
  },
  balances: {
    width: '100%',
    textAlign: 'right',
    paddingRight: '20px',
    cursor: 'pointer'
  },
  stakeTitle: {
    width: '100%',
    color: colors.darkGray,
    marginBottom: '20px'
  },
  stakeButtons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    align: 'center',
    marginTop: '20px'
  },
  stakeButton: {
    minWidth: '300px'
  },
  requirement: {
    display: 'flex',
    alignItems: 'center'
  },
  check: {
    paddingTop: '6px'
  },
  voteLockMessage: {
    margin: '20px'
  },
  title: {
    width: '100%',
    color: colors.darkGray,
    minWidth: '100%',
    marginLeft: '20px'
  },
})

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class Stake extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')
    const pool = store.getStore('currentPool')
    const governanceContractVersion = store.getStore('governanceContractVersion')

    if(!pool) {
      props.history.push('/')
    }

    this.state = {
      pool: pool,
      loading: !(account || pool),
      account: account,
      value: 'options',
      voteLockValid: false,
      balanceValid: false,
      voteLock: null,
      earned: 0,
      lpbalance: 0,
      stakedbalance: 0,
      governanceContractVersion: governanceContractVersion
    }

    if(pool && ['FeeRewards', 'Governance'].includes(pool.id)) {
      dispatcher.dispatch({ type: GET_YCRV_REQUIREMENTS, content: {} })
    }

    if(pool && ['GovernanceV2'].includes(pool.id)) {
      dispatcher.dispatch({ type: GET_GOVERNANCE_REQUIREMENTS, content: {} })
    }
  }

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(STAKE_RETURNED, this.showHash);
    emitter.on(WITHDRAW_RETURNED, this.showHash);
    emitter.on(EXIT_RETURNED, this.showHash);
    emitter.on(GET_REWARDS_RETURNED, this.showHash);
    emitter.on(GET_REWARDS_AVAILABLE, this.updateRewards);
    emitter.on(GET_YCRV_REQUIREMENTS_RETURNED, this.yCrvRequirementsReturned);
    emitter.on(GET_GOVERNANCE_REQUIREMENTS_RETURNED, this.govRequirementsReturned);
    emitter.on(GET_BALANCES, this.balancesReturnedAfterStake);
    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(STAKE_RETURNED, this.showHash);
    emitter.removeListener(WITHDRAW_RETURNED, this.showHash);
    emitter.removeListener(EXIT_RETURNED, this.showHash);
    emitter.removeListener(GET_REWARDS_RETURNED, this.showHash);
    emitter.removeListener(GET_YCRV_REQUIREMENTS_RETURNED, this.yCrvRequirementsReturned);
    emitter.removeListener(GET_GOVERNANCE_REQUIREMENTS_RETURNED, this.govRequirementsReturned);
    emitter.removeListener(GET_BALANCES, this.balancesReturnedAfterStake);
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned);
    this.setState = (state,callback)=>{
      return;
    };    
  };

  balancesReturned = (nada, balance, staked, earned) => {
    this.setState({ earned: earned, lpbalance: balance, stakedBalance: staked })    
  }

  balancesReturnedAfterStake = () => {
    const currentPool = store.getStore('currentPool')
    const pools = store.getStore('rewardPools')
    let newPool = pools.filter((pool) => {
      return pool.id === currentPool.id
    })

    if(newPool.length > 0) {
      newPool = newPool[0]
      store.setStore({ currentPool: newPool })
    }
  } 

  yCrvRequirementsReturned = (requirements) => {
    this.setState({
      balanceValid: requirements.balanceValid,
      voteLockValid: requirements.voteLockValid,
      voteLock: requirements.voteLock
    })
  }

  govRequirementsReturned = (requirements) => {
    this.setState({
      gov_voteLockValid: requirements.voteLockValid,
      gov_voteLock: requirements.voteLock
    })
  }

  showHash  = (txHash) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  };

  updateRewards = (earned) => {
    this.setState({ earned: earned })    
    //console.log("Earned updated:" + earned);
  };  
  

  errorReturned = (error) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error' }
      that.setState(snackbarObj)
    })
  };

  render() {
    const { classes } = this.props;
    const {
      value,
      account,
      modalOpen,
      pool,
      loading,
      snackbarMessage,
      voteLockValid,
      balanceValid,
      gov_voteLock,
      gov_voteLockValid
    } = this.state    

    var address = null;
    if (account.address) {
      address = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }

    if(!pool) {
      return null
    }

    return (
      <div className={ classes.root }>  
          <Card className={ classes.addressContainer } onClick={this.overlayClicked}>
          <div style={{ background: '#DC6BE5', opacity: '1', borderRadius: '10px', width: '10px', height: '10px', marginRight: '3px', marginTop:'3px', marginLeft:'6px' }}></div>
            <Typography variant={ 'h4'} className={ classes.walletAddress } noWrap>{ address }</Typography>            
          </Card>            
        <div className={ classes.intro }>
          <Button
            className={ classes.stakeButton }
            variant="outlined"
            color="secondary"
            disabled={ loading }
            onClick={ () => {  this.props.history.push('/') } }
          >
            <Typography variant={ 'h4'}>Back</Typography>
          </Button>
        </div>
        <div className={ classes.overview }>
          <div className={ classes.overviewField }>
            <Typography variant={ 'h3' } className={ classes.overviewTitle }>Your Balance</Typography>
            <Typography variant={ 'h2' } className={ classes.overviewValue }>{ pool.tokens[0].balance ? (pool.tokens[0].balance < 0.0001 ? pool.tokens[0].balance.toExponential() : pool.tokens[0].balance) : "0" }  { pool.tokens[0].symbol }</Typography>
          </div>
          <div className={ classes.overviewField }>
            <Typography variant={ 'h3' } className={ classes.overviewTitle }>Currently Staked</Typography>
            <Typography variant={ 'h2' } className={ classes.overviewValue }>{ pool.tokens[0].stakedBalance ? (pool.tokens[0].stakedBalance < 0.0001 ? pool.tokens[0].stakedBalance.toExponential() : pool.tokens[0].stakedBalance) : "0" }</Typography>
          </div>
          <div className={ classes.overviewField }>
            <Typography variant={ 'h3' } className={ classes.overviewTitle }>Rewards Available</Typography>
             {/*<Typography variant={ 'h2' } className={ classes.overviewValue }>{ pool.tokens[0].rewardsSymbol == '$' ? pool.tokens[0].rewardsSymbol : '' } { pool.tokens[0].rewardsAvailable ? (pool.tokens[0].rewardsDecimals > 0 ? pool.tokens[0].rewardsAvailable : pool.tokens[0].rewardsAvailable.toFixed(2)) : "0" } { this.state.earned } { pool.tokens[0].rewardsSymbol != '$' ? pool.tokens[0].rewardsSymbol : '' }</Typography>*/}
             <Typography variant={ 'h2' } className={ classes.overviewValue }>{ pool.tokens[0].rewardsSymbol == '$' ? pool.tokens[0].rewardsSymbol : '' } { (this.state.earned > pool.tokens[0].rewardsAvailable)?this.state.earned:pool.tokens[0].rewardsAvailable} { pool.tokens[0].rewardsSymbol != '$' ? pool.tokens[0].rewardsSymbol : '' }</Typography>
          </div>
        </div>
        { ['FeeRewards'].includes(pool.id) &&
          <div className={ classes.actions }>
            <Typography className={ classes.stakeTitle } variant={ 'h3'}>yCRV reward requirements</Typography>
            <div className={ classes.requirement }>
              <Typography variant={'h4'}>You must have voted in a proposal recently</Typography><Typography variant={'h4'} className={ classes.check }>{ voteLockValid ? <CheckIcon style={{ color: colors.green }} /> : <ClearIcon style={{ color: colors.red }} /> }</Typography>
            </div>
            <div className={ classes.requirement }>
              <Typography variant={'h4'}>You must have at least 1000 BPT staked in the Governance pool</Typography><Typography variant={'h4'} className={ classes.check }>{ balanceValid ? <CheckIcon style={{ color: colors.green }} /> : <ClearIcon style={{ color: colors.red }} /> }</Typography>
            </div>
          </div>
        }
        { value === 'options' && this.renderOptions() }
        { value === 'stake' && this.renderStake() }
        { value === 'claim' && this.renderClaim() }
        { value === 'unstake' && this.renderUnstake() }
        { value === 'exit' && this.renderExit() }

        { snackbarMessage && this.renderSnackbar() }
        { loading && <Loader /> }
      </div>
    )
  }

  renderOptions = () => {
    const { classes } = this.props;
    const {
      loading,
      pool,
      voteLockValid,
      balanceValid,
      voteLock,
      gov_voteLockValid,
      gov_voteLock,
    } = this.state

    return (
      <div className={ classes.actions }>
          {/*<img height="40" src={UNIlogo}/>&nbsp;&nbsp;*/}
          <Typography variant={ 'h3'} className={ classes.title } noWrap>{ pool.name }</Typography>
        <div className={ classes.actionContainer}>
          <Button
            fullWidth
            className={ classes.primaryButton }
            variant="outlined"
            color="primary"
            disabled={ !pool.depositsEnabled || (['FeeRewards'].includes(pool.id) ?  (loading || !voteLockValid || !balanceValid) : loading) }
            onClick={ () => { this.navigateInternal('stake') } }
            >
            <Typography className={ classes.stakeButtonText } variant={ 'h4'}>Stake Tokens</Typography>
          </Button>
        </div>
        <div className={ classes.actionContainer}>
          <Button
            fullWidth
            className={ classes.actionButton }
            variant="outlined"
            color="primary"
            disabled={ loading || (['GovernanceV2'].includes(pool.id) && !gov_voteLockValid) }
            onClick={ () => { this.onClaim() } }
            >
            <Typography className={ classes.buttonText } variant={ 'h4'}>Claim Rewards</Typography>
          </Button>
        </div>
        <div className={ classes.actionContainer}>
          <Button
            fullWidth
            className={ classes.actionButton }
            variant="outlined"
            color="primary"
            disabled={ loading  || (['GovernanceV2'].includes(pool.id) && gov_voteLockValid) || (pool.id === 'Governance' && (voteLockValid )) }
            onClick={ () => { this.navigateInternal('unstake') } }
            >
            <Typography className={ classes.buttonText } variant={ 'h4'}>Unstake Tokens</Typography>
          </Button>
        </div>
        <div className={ classes.actionContainer}>
          { !['GovernanceV2'].includes(pool.id) &&
            <Button
              fullWidth
              className={ classes.actionButton }
              variant="outlined"
              color="primary"
              disabled={ (pool.id === 'Governance' ? (loading || voteLockValid ) : loading  ) }
              onClick={ () => { this.onExit() } }
              >
              <Typography className={ classes.buttonText } variant={ 'h4'}>Exit: Claim and Unstake</Typography>
            </Button>
          }
        </div>
        { (['Governance', 'GovernanceV2'].includes(pool.id) && voteLockValid) && <Typography variant={'h4'} className={ classes.voteLockMessage }>Unstaking tokens only allowed once all your pending votes have closed at Block: {voteLock}</Typography> }
        { (['GovernanceV2'].includes(pool.id) && !gov_voteLockValid) && <Typography variant={'h4'} className={ classes.voteLockMessage }>You need to have voted recently in order to claim rewards</Typography> }
        { (['GovernanceV2'].includes(pool.id) && gov_voteLockValid) && <Typography variant={'h4'} className={ classes.voteLockMessage }>You have recently voted, you can unstake at block {gov_voteLock}</Typography> }
      </div>
    )
  }

  navigateInternal = (val) => {
    this.setState({ value: val })
  }

  renderStake = () => {
    const { classes } = this.props;
    const { loading, pool } = this.state

    const asset = pool.tokens[0]

    return (
      <div className={ classes.actions }>
        <Typography className={ classes.stakeTitle } variant={ 'h3'}>Stake your tokens</Typography>
        { this.renderAssetInput(asset, 'stake') }
        <div className={ classes.stakeButtons }>
          <Button
            className={ classes.stakeButton }
            variant="outlined"
            color="secondary"
            disabled={ loading }
            onClick={ () => { this.navigateInternal('options') } }
          >
            <Typography variant={ 'h4'}>Back</Typography>
          </Button>
          <Button
            className={ classes.stakeButton }
            variant="outlined"
            color="secondary"
            disabled={ loading }
            onClick={ () => { this.onStake() } }
          >
            <Typography variant={ 'h4'}>Stake</Typography>
          </Button>
        </div>

      </div>
    )
  }

  renderUnstake = () => {
    const { classes } = this.props;
    const { loading, pool, voteLockValid } = this.state

    const asset = pool.tokens[0]

    return (
      <div className={ classes.actions }>
        <Typography className={ classes.stakeTitle } variant={ 'h3'}>Unstake your UNI-V2 tokens</Typography>
        { this.renderAssetInput(asset, 'unstake') }
        <div className={ classes.stakeButtons }>
          <Button
            className={ classes.stakeButton }
            variant="outlined"
            color="secondary"
            disabled={ loading }
            onClick={ () => { this.navigateInternal('options') } }
          >
            <Typography variant={ 'h4'}>Back</Typography>
          </Button>
          <Button
            className={ classes.stakeButton }
            variant="outlined"
            color="secondary"
            disabled={ (pool.id === 'Governance' ? (loading || voteLockValid ) : loading  ) }
            onClick={ () => { this.onUnstake() } }
          >
            <Typography variant={ 'h4'}>Unstake</Typography>
          </Button>
        </div>

      </div>
    )
  }

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  onStake = () => {
    this.setState({ amountError: false })
    const { pool } = this.state
    const tokens = pool.tokens
    const selectedToken = tokens[0]
    const amount = this.state[selectedToken.id + '_stake']

    if(amount > selectedToken.balance) {
       this.setState({ amountError: true, amountErrorText: "You cannot stake more than your available unstaked balance" })
       return false
    }
    if (isNaN(amount)) {
      this.setState({ amountError: true, amountErrorText: "You should to write a number" })      
      return false
    }    
    if (amount <= 0) {      
      this.setState({ amountError: true, amountErrorText: "Amount should to be greater than 0" })
      return false
    }
    this.setState({ loading: true })
    dispatcher.dispatch({ type: STAKE, content: { asset: selectedToken, amount: amount } })
  }

  onClaim = () => {
    const { pool } = this.state
    const tokens = pool.tokens
    const selectedToken = tokens[0]
    console.log("Calling claim 0");
    this.setState({ loading: true })
    dispatcher.dispatch({ type: GET_REWARDS, content: { asset: selectedToken } })
  }

  onUnstake = () => {
    this.setState({ amountError: false })
    const { pool } = this.state
    const tokens = pool.tokens
    const selectedToken = tokens[0]
    const amount = this.state[selectedToken.id + '_unstake']
    
    //console.log(selectedToken.stakedBalance);
    if(amount > selectedToken.stakedBalance) {
      this.setState({ amountError: true, amountErrorText: "You cannot unstake more than your staked balance" })
      return false
    }
    if (isNaN(amount)) {
      this.setState({ amountError: true, amountErrorText: "You should to write a number" })      
       return false
    }     
    if (amount <= 0) {      
      this.setState({ amountError: true, amountErrorText: "Amount should to be greater than 0" })
      return false
    }

    this.setState({ loading: true })
    dispatcher.dispatch({ type: WITHDRAW, content: { asset: selectedToken, amount: amount } })
  }

  onExit = () => {
    const { pool } = this.state
    const tokens = pool.tokens
    const selectedToken = tokens[0]

    this.setState({ loading: true })
    dispatcher.dispatch({ type: EXIT, content: { asset: selectedToken } })
  }

  renderAssetInput = (asset, type) => {
    const {
      classes
    } = this.props

    const {
      loading
    } = this.state

    const amount = this.state[asset.id + '_' + type]
    const amountError = this.state[asset.id + '_' + type + '_error']

    return (
      <div className={ classes.valContainer } key={asset.id + '_' + type}>
        <div className={ classes.balances }>
          { console.log("amountError:" + this.state.amountError)}
          { type === 'stake' && <Typography variant='h4' onClick={ () => { this.setAmount(asset.id, type, (asset ? asset.balance : 0)) } } className={ classes.value } noWrap>{ 'Balance: '+ ( asset && asset.balance ? asset.balance.toFixed(18) : '0.0000') } { asset ? asset.symbol : '' }</Typography> }
          { type === 'unstake' && <Typography variant='h4' onClick={ () => { this.setAmount(asset.id, type, (asset ? asset.stakedBalance : 0)) } } className={ classes.value } noWrap>{ 'Balance: '+ ( asset && asset.stakedBalance ? asset.stakedBalance.toFixed(18) : '0.0000') } { asset ? asset.symbol : '' }</Typography> }
        </div>
        <div>
          <TextField
            fullWidth
            disabled={ loading }
            className={ classes.actionInput }
            id={ '' + asset.id + '_' + type }
            value={ amount }
            error={ this.state.amountError }
            onChange={ this.onChange }
            placeholder="0.00"
            variant="outlined"            
            InputProps={{
              endAdornment: <InputAdornment position="end" className={ classes.inputAdornment }><Typography variant='h3' className={ '' }>{ asset.symbol }</Typography></InputAdornment>,
              startAdornment: <InputAdornment position="end" className={ classes.inputAdornment }>
              </InputAdornment>,
            }}
          />
        </div>
      </div>
    )
  }

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  setAmount = (id, type, balance) => {
    const bal = balance.toFixed(18)
    let val = []
    val[id + '_' + type] = bal
    this.setState(val)
  }

}

export default withRouter(withStyles(styles)(Stake));
