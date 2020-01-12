import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import contract from 'truffle-contract'
import DemystifyTokenSale from '../../build/contracts/DemystifyTokenSale.json'
import DemystifyToken from '../../build/contracts/DemystifyToken.json'
import Content from './Content'
import 'bootstrap/dist/css/bootstrap.css'
import LinearProgress from '@material-ui/core/LinearProgress';
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import {Formik, FieldArray,} from "formik";
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import TextField from "@material-ui/core/TextField";
import getWeb3 from "./Utils/getWeb3";
import 'babel-polyfill';


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
            numberOfTokens: '',
            tokenSaleInstance: '',
            tokenInstance: '',
        };


        this.buyToken = this.buyToken.bind(this);
        this.handleChange = this.handleChange.bind(this)

        this.castVote = this.castVote.bind(this)
        this.watchEvents = this.watchEvents.bind(this)
    }

    handleChange(e) {
        this.setState({numberOfTokens: e.target.value});
    }

    componentDidMount = async () => {
        console.log('here');
        try {

            // Use web3 to get the user's accounts.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.


            const accounts = await web3.eth.getAccounts();
            // Get the contract instance.


            const networkId = await web3.eth.net.getId();
            let deployedNetwork = DemystifyTokenSale.networks[networkId];
            let tokenSaleInstance = new web3.eth.Contract(
                DemystifyTokenSale.abi,
                deployedNetwork && deployedNetwork.address,
            );

            let deployedNetworkForToken = DemystifyToken.networks[networkId];

            let tokenInstance = new web3.eth.Contract(
                DemystifyToken.abi,
                deployedNetworkForToken && deployedNetworkForToken.address,
            );
            console.log(tokenInstance,tokenSaleInstance);

            let account = accounts[0];
            let tokenPrice = await tokenSaleInstance.methods.tokenPrice().call();
            let tokenSold = await tokenSaleInstance.methods.tokensSold().call();
            let accountToken = await tokenInstance.methods.balanceOf(account.toString()).call();
            let e = await tokenInstance.methods.balanceOf(deployedNetwork.address).call();
            console.log(e);
            try {
                console.log(
                    deployedNetwork.address,
                    tokenAvailable,
                    accountToken,

                );
                let result = tokenInstance.methods.transfer(deployedNetwork.address, tokenAvailable).send({
                    from: account,
                    gas: 500000,
                });
            } catch (e) {
                console.log(e);
            }

            // TODO: Refactor with promise chain
            // this.watchEvents();



            let tokenBought = await tokenSold / tokenAvailable;


            // this.setState({
            //     account,
            //     tokenPrice:tokenPrice.toNumber(),
            //     tokenSold:tokenSold.toNumber(),
            //     accountToken:accountToken.toNumber(),
            //     tokenBought:tokenBought.toNumber(),
            //     tokenSaleInstance,
            //     tokenInstance
            // })
            console.log({
                account,
                tokenPrice: tokenPrice,
                tokenSold,
                accountToken,
                tokenBought,
                tokenSaleInstance,
                tokenInstance
            })
            this.setState({
                account,
                tokenPrice: parseInt(tokenPrice),
                tokenSold,
                accountToken,
                tokenBought,
                tokenSaleInstance,
                tokenInstance
            })
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`
            );
            console.log(error);
        }
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

    async buyToken() {

        let {
            numberOfTokens,
            tokenPrice,
            account,
            tokenSaleInstance
        } = this.state;


        numberOfTokens = parseInt(numberOfTokens);
        console.log({
            numberOfTokens,
            from: account,
            value: parseInt(numberOfTokens) * tokenPrice,
            gas: 500000,
            message: 'not empty string'


        });

        let result = await tokenSaleInstance.methods.buyTokens(parseInt(numberOfTokens)).send({
            from: account,
            value: parseInt(numberOfTokens) * tokenPrice,
            gas: 500000,
            message: 'not empty string'
        });
        console.log(result);
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
            account, accountToken, numberOfTokens
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

                    <FormControl fullWidth>
                        <TextField
                            margin="normal"
                            name="Amount"
                            type="Amount"
                            placeholder="Amount"
                            onChange={this.handleChange}
                            value={numberOfTokens}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<Icon>send</Icon>}
                            onClick={this.buyToken}
                        >
                            Send
                        </Button>

                    </FormControl>

                </div>
                <div className='col-lg-12 text-center'>
                    <p>
                        The price of the Token : <b>  {tokenPrice} </b>
                    </p>
                    <p>
                        you have Bought <b> {accountToken} </b>
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
    <App/>
    ,
    document.querySelector('#root')
)
