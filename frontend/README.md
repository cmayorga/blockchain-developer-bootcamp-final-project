# BOOTCAMP CONS finance

We will use Ropsten as network to do the tests

We need a serie of contracts and tokens to execute our project, we will verify all to use etherscan.io web3 functions:

CONS ERC20 token to stake and get rewards: Created and verified at https://ropsten.etherscan.io/address/0x69fae47f4a2d01f66b29e068a62e89e150b9a1d1

CARLOS ERC20 is the token we will use as reward token for farmers: Created and verified at https://ropsten.etherscan.io/address/0xc37f866b567127b2933781f6c5572389291cbe99

We need all to be mintable to add supply and add liquidity to the pool

I will execute addMinter in both WETH and CONS tokens and after i will execute mint to my address in order to have liquidity in both tokens to add to the pool

CONS 

addMinter tx https://ropsten.etherscan.io/tx/0xea093f3f71786344ffbd61fdf13105a8c6dc017ffd9a417bc4c501232f238e06

mint 100000000000000000000000000 tx https://ropsten.etherscan.io/tx/0x6fdaa57bd32c987d6dd89164061537a4fa4abb7642ffa377e56e4f7f0f703417

Now we configure (hardcoding our CONS token) our CONSRewards contract, deploy and verify it:

CONSRewards contract: https://ropsten.etherscan.io/address/0xcf87c85097ac3c8af52e8b29bff1fbb38068e35c

Now we need to add this contract as minter at CARLOS reward token in order to allow Reward contract to mint and transfer tokens to farmers.

Minter added tx: https://ropsten.etherscan.io/tx/0x84b87dbf277bee8aaf8903e07f30dc8fc43ef49ca78dab760ec891991e5f3aad

Next step is to start the farm, so we execute notifyRewardAmount at CONSReward contract by owner

tx: https://ropsten.etherscan.io/tx/0x681f1ef1062ac834f5f323ecd4671f844d58410b2a29a78ded6402a19f9e0667









## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
