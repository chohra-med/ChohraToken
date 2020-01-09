import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import DemystifyTokenSale from '../../build/contracts/DemystifyTokenSale.json'
import DemystifyToken from '../../build/contracts/DemystifyToken.json'
import Content from './Content'
import 'bootstrap/dist/css/bootstrap.css'
import LinearProgress from '@material-ui/core/LinearProgress';

const tokenAvailable = 750000;

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tokenBought: 0,
            account: '0x0',
            loading: true,
            tokenSold: 0,
            tokenPrice: 0,
            accountToken: 0,
        };

        if (typeof web3 != 'undefined') {
            this.web3Provider = web3.currentProvider
        } else {
            this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
        }

        this.web3 = new Web3(this.web3Provider);
        this.demystifyToken = TruffleContract(DemystifyToken);
        this.demystifyToken.setProvider(this.web3Provider);

        this.demystifyTokenSale = TruffleContract(DemystifyTokenSale);
        this.demystifyTokenSale.setProvider(this.web3Provider);


        this.castVote = this.castVote.bind(this)
        this.watchEvents = this.watchEvents.bind(this)
    }

    componentDidMount() {
        // TODO: Refactor with promise chain
        this.web3.eth.getCoinbase((err, account) => {
            this.setState({account});
            this.demystifyTokenSale.deployed().then((tokenSaleInstance) => {
                this.tokenSaleInstance = tokenSaleInstance;
                // this.watchEvents();

                this.tokenSaleInstance.tokenPrice().then(price => {
                    this.setState({
                        tokenPrice: price.toNumber()
                    })
                });
                this.tokenSaleInstance.tokensSold().then(price => {
                    this.setState({
                        tokenSold: price.toNumber(),
                        tokenBought: price.toNumber() / tokenAvailable
                    })
                });
            });
            this.demystifyToken.deployed().then((tokenInstance) => {
                this.tokenInstance = tokenInstance;

                this.tokenInstance.totalSupply().then(totalSupply =>
                    console.log(totalSupply)
                )
                this.tokenInstance.name().then(name =>
                    console.log(name)
                )
                this.tokenInstance.balanceOf(account.toString()).then(accountToken => {
                    console.log('here', typeof (accountToken));
                    this.setState({
                        accountToken: accountToken.toNumber(),
                    })
                });
            });
        })
    }

    watchEvents() {
        // TODO: trigger event when vote is counted, not when component renders
        this.electionInstance.votedEvent({}, {
            fromBlock: 0,
            toBlock: 'latest'
        }).watch((error, event) => {
            this.setState({voting: false})
        })
    }

    castVote(candidateId) {
        this.setState({voting: true})
        this.electionInstance.vote(candidateId, {
            from: this.state.account,
            gas: 500000
        }).then((result) => {
            console.log('worked');
            this.setState({hasVoted: true})
        }).catch(e => console.log(e))
    }

    render() {
        const {
            tokenBought, tokenSold, tokenPrice,
            account
        } = this.state;
        return (
            <div className='row'>
                <div className='col-lg-12 text-center'
                >
                    <h1>Demystify Token</h1>
                    <LinearProgress
                        variant="determinate"
                        color="primary"
                        value={tokenBought}
                        style={{
                            height: 20,
                            borderRadius: 20,
                            marginHorizontal: 20,
                        }}
                    />
                    <p style={{
                        marginTop: 20,
                    }}
                    >
                        {tokenSold} / {tokenAvailable}
                    </p>
                </div>
                <div className='col-lg-12 text-center'>
                    <p>
                        The price of the Token : <b>  {tokenPrice} </b>
                    </p>
                    <p>
                        your account address is <b> {account} </b>
                    </p>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.querySelector('#root')
)
