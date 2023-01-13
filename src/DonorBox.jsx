export default function DonorBox(props) {
    return (
        <>
            <script src="https://donorbox.org/widget.js" paypalExpress="false"></script><iframe src="https://donorbox.org/embed/world-science-dao?default_interval=o&amount=100" name="donorbox" allowpaymentrequest="allowpaymentrequest" seamless="seamless" frameborder="0" scrolling="no" height="900px" width="100%" style={{maxWidth: '500px', minWidth: '310px', maxHeight:'none!important'}} title="DonorBox"></iframe>
        </>
    );
}