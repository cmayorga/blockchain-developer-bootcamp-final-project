import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {withStyles} from '@material-ui/core/styles';
import CARLOSlogo from '../../assets/carlos_logo.jpg';
import UNIlogo from '../../assets/uniswap.png';
import {
    Typography,
    Button,
    Card
} from '@material-ui/core';
import {withNamespaces} from 'react-i18next';

import UnlockModal from '../unlock/unlockModal.jsx'
import Store from "../../stores";
import {colors} from '../../theme';
import Countdown from '../countdown/Countdown.jsx';
import config from '../../config'

import {
    ERROR,
    CONFIGURE_RETURNED,
    GET_BALANCES,
    GET_BALANCES_RETURNED,
    GOVERNANCE_CONTRACT_CHANGED
} from '../../constants'

const styles = theme => ({
    root: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '600px',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: '40px',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    intro: {
        width: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '400px'
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
    actionButton: {
        '&:hover': {
            backgroundColor: "#2F80ED",
        },
        padding: '12px',
        backgroundColor: "#2F80ED",
        borderRadius: '1rem',
        border: '1px solid #E1E1E1',
        fontWeight: 500,
        [theme.breakpoints.up('md')]: {
            padding: '15px',
        }
    },
    buttonText: {
        fontWeight: '700',
        color: 'white',
    },
    disaclaimer: {
        padding: '12px',
        marginTop: '20px',
        //border: '1px solid rgb(174, 174, 174)',
        //borderRadius: '0.75rem',
        marginBottom: '0px',
        textAlign: 'center',
        width: '100%',
    },
    footer: {
        padding: '12px',
        paddingTop: '0',
        paddingBottom: '30px',
        textAlign: 'justify',
        width: '100%',
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto',
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
    rewardPools: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        paddingTop: '20px',
        flexWrap: 'wrap'
    },
    rewardPoolContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: '28px 30px',
        borderRadius: '50px',
        boxShadow: 'rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 0px 16px 24px, rgba(0, 0, 0, 0.01) 0px 24px 32px',        
        //border: '1px solid ' + colors.borderBlue,
        margin: '20px',
        background: colors.white,
        minHeight: '300px',
        minWidth: '200px',
    },
    title: {
        width: '100%',
        color: colors.darkGray,
        minWidth: '100%',
        marginLeft: '20px'
    },
    poolName: {
        paddingBottom: '20px',
        color: colors.text
    },
    tokensList: {
        color: colors.darkGray,
        paddingBottom: '20px',
    },
    poolWebsite: {
        color: colors.darkGray,
        paddingBottom: '20px',
        textDecoration: 'none'
    }
})

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class RewardPools extends Component {

    constructor(props) {
        super()

        const account = store.getStore('account')
        const governanceContractVersion = store.getStore('governanceContractVersion')
        const rewardPools = store.getStore('rewardPools')

        this.state = {
            rewardPools: rewardPools,
            loading: !(account && rewardPools),
            account: account,
            governanceContractVersion: governanceContractVersion
        }

        dispatcher.dispatch({type: GET_BALANCES, content: {}})
    }

    componentWillMount() {
        emitter.on(CONFIGURE_RETURNED, this.configureReturned);
        emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);
        emitter.on(GOVERNANCE_CONTRACT_CHANGED, this.setGovernanceContract);
    }

    componentWillUnmount() {
        emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
        emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned);
        emitter.removeListener(GOVERNANCE_CONTRACT_CHANGED, this.setGovernanceContract);
    };

    setGovernanceContract = () => {
        this.setState({governanceContractVersion: store.getStore('governanceContractVersion')})
    }

    balancesReturned = () => {
        const rewardPools = store.getStore('rewardPools');
        this.setState({rewardPools: rewardPools})
    }

    configureReturned = () => {
        this.setState({loading: false})
    }

    render() {
        const {classes} = this.props;
        const {
            value,
            account,
            loading,
            modalOpen,
        } = this.state

        var address = null;
        if (account.address) {
            address = account.address.substring(0, 6) + '...' + account.address.substring(account.address.length - 4, account.address.length)
        }

        return (
            <div style={{width: '100%'}}>
                <div className={classes.root}>                   
                    <Card className={classes.addressContainer} onClick={this.overlayClicked}>
                        <div style={{background: '#DC6BE5', opacity: '1', borderRadius: '10px', width: '10px', height: '10px', marginRight: '3px', marginTop: '3px', marginLeft: '6px'}}></div>
                        <Typography variant={'h4'} className={classes.walletAddress} noWrap>{address}</Typography>
                    </Card>
                    <row>
					{/*
                    <Button
                        variant="outlined"
                        color="secondary"
                        href={config.uniswappool}
                        target="_blank"
                    >
                        <img height="40" src={UNIlogo}/>&nbsp;&nbsp;
                        <Typography variant={'h4'}>WETH/CONS Liquidity pool</Typography>
                    </Button>
					/*}
                    {/*}
                    &nbsp;&nbsp;
                    <Button
                        variant="outlined"
                        color="secondary"
                        href={config.carlosswap}
                        target="_blank"
                    >
                        <img height="40" src={UNIlogo}/>&nbsp;&nbsp;
                        <Typography variant={'h4'}>Swap for CONS</Typography>
                    </Button>   
                    */}
                    </row>                 

                    <div className={classes.rewardPools}>
                        {
                            this.renderRewards()
                        }
                    </div>
                    <hr />
                    {modalOpen && this.renderModal()}
                </div>
            </div>            
        )
    }

    renderRewards = () => {
        const {rewardPools, governanceContractVersion} = this.state

        return rewardPools.filter((rewardPool) => {
            if (['Uniswap', 'Balancer', 'PoolC', 'PoolD'].includes(rewardPool.id)) {
                return true
            } else {
                return false
            }
        }).map((rewardPool) => {
            return this.renderRewardPool(rewardPool)
        })
    }

    renderRewardPool = (rewardPool) => {

        const {classes} = this.props

        var address = null;
        let addy = ''
        if (rewardPool.tokens && rewardPool.tokens[0]) {
            addy = rewardPool.tokens[0].rewardsAddress
            address = addy.substring(0, 6) + '...' + addy.substring(addy.length - 4, addy.length)
        }

        return (<div className={classes.rewardPoolContainer} key={rewardPool.id}>
            <Typography variant='h3' className={classes.poolName}>{rewardPool.name}</Typography>            
            <Typography varian='h5' className={classes.tokensList} align='center'>
                Stake {rewardPool.tokens[0].symbol} for {rewardPool.tokens[0].rewardsSymbol}.
            </Typography>
            <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                    if (rewardPool.tokens.length > 0) {
                        this.navigateStake(rewardPool)
                    }
                }}
            >
                <Typography variant={'h4'}>{rewardPool.stakingName}</Typography>
            </Button>
            <br/>
            <img height="80" src={CARLOSlogo}/>
            <Countdown 
                      timeTillDate="05 26 2022, 6:00 am" 
                       timeFormat="MM DD YYYY, h:mm a" 
                />                         
        </div>)
    }

    navigateStake = (rewardPool) => {
        store.setStore({currentPool: rewardPool})

        this.props.history.push('/stake')
    }

    renderModal = () => {
        return (
            <UnlockModal closeModal={this.closeModal} modalOpen={this.state.modalOpen}/>
        )
    }

    overlayClicked = () => {
        this.setState({modalOpen: true})
    }

    closeModal = () => {
        this.setState({modalOpen: false})
    }

}

export default withRouter(withStyles(styles)(RewardPools));
