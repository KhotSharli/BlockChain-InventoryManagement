// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");



const DeployModule = buildModule("InventoryModule",(m)=>{
  const sample =  m.contract("Inventory");
  return sample;
})

module.exports = DeployModule;