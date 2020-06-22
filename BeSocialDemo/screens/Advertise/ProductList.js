import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PricingCard } from "react-native-elements";
import { updateNextStep } from '../../actions/main';
import {
  updateSelectedProductPrice,
  updateSelectedProduct,
} from '../../actions/product';

import { Colors } from './../../styles';
import { LogError } from "./../../global";


class ProductList extends Component {
  render() {
    const { productlist, ismobile } = this.props;
    return (
      productlist.map((item, idx) => {
        const price = item.price;
        if (item.ismobile === ismobile && item.isenabled) {
          return <PricingCard
            key={item.id}
            ref="pricing"
            color={Colors.primaryColor}
            containerStyle={{ backgroundColor: Colors.black }}
            infoStyle={{ color: Colors.white }}
            pricingStyle={{ color: Colors.orange }}
            titleStyle={{ color: Colors.white }}
            title={item.name}
            price={`$${(price / 100)}.00`} //.toLocaleString("en-US", { style: "currency", currency: "USD" })}
            info={[item.description]}
            button={{ title: 'Pick', icon: 'attach-money' }}
            onButtonPress={() => {
              try {
                this.props.updateSelectedProductPrice(price);
                this.props.updateSelectedProduct(item);
                this.props.updateNextStep();
              } catch (error) {
                LogError('ProductList::Pricing', error);
              }
            }}
          />
        }
      })
    )
  }
}

function mapStateToProps(state) {
  return {
    productlist: state.product.list.items,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateSelectedProductPrice: (amount) => dispatch(updateSelectedProductPrice(amount)),
    updateSelectedProduct: (item) => dispatch(updateSelectedProduct(item)),
    updateNextStep: () => dispatch(updateNextStep()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductList)
