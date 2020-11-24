import React, { Component } from 'react';

import { Dialog } from '../../../base/dialog';


/**
 * Implements a React {@link Component} which displays the component
 * {@code VideoQualitySlider} in a dialog.
 *
 * @extends Component
 */
export default class TipDialog extends Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */





    render() {

      var tiphtml = '<div id="please_tip">'
         +'<h1>Eds Virtual Bar ✌️</h1>'
         +'<p>Thanks for tipping.  It helps pay the nightly server bill to keep the bars open. </p>'
         +'<p>What features would you like to see? Get in touch via <a href="mailto:edsvirtualbar@gmail.com">edsvirtualbar@gmail.com</a> and Follow @edsvbar on <a href="https://facebook.com/edsvbar">facebook</a>, <a href="https://instagram.com/edsvbar">instagram</a>, and <a href="http://twitter.com/edsvbar">twitter</a> for all the latest.</p><p>'
         +'</p><div class="payment" id="paypal">'
           +'<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">'
             +'<input type="hidden" name="cmd" defaultValue="_donations" />'
             +'<input type="hidden" name="business" defaultValue="filowatt@gmail.com" />'
             +'<input type="hidden" name="item_name" defaultValue="Help us pay the server costs to keep the bars open." />'
             +'<input type="hidden" name="currency_code" defaultValue="USD" />'
             +'<input type="image" className="paypal_image" id="tips" src="https://edsvbar.com/img/paypal.png" border={0} name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />'
             +'<img alt="" border={0} src="https://www.paypal.com/en_US/i/scr/pixel.gif" width={1} height={1} />'
           +'</form>'
         +'</div>'
         +'<div class="payment" id="venmo">'
           +'<a href="http://venmo.com/edfilo" target="_blank"><img id="venmo_img" src="https://edsvbar.com/img/venmo.png" /></a>'
         +'</div>'
       +'</div>';



        return (
            <Dialog
                hideCancelButton = { true }
                okKey = 'dialog.done'
                width = 'small'>
                <div dangerouslySetInnerHTML={{ __html: tiphtml }} />
            </Dialog>
        );
    }
}
