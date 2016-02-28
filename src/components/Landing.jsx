//require('../style/less/grayscale.less');
//require('../style/sass/grayscale.scss');
import styles from '../style/sass/grayscale.scss';
import cnames from 'classnames/dedupe';

import React from 'react';

import '../util/grayscale.js';

const Landing = (props) => {

const pclone = Object.assign({}, props);
const root = styles.landing;

console.log('styles is: ' + JSON.stringify(styles))

console.log('root is: ' + root)

return (
<div className={cnames("react-body", root)} data-target=".navbar-fixed-top" data-spy="scroll">
{/*<!-- Navigation -->*/}
<nav className="navbar navbar-custom navbar-fixed-top" role="navigation">
    <div className="container">
        <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-main-collapse">
                <i className="fa fa-bars"></i>
            </button>
            <a className="navbar-brand page-scroll" href="#page-top">
                <i className="fa fa-play-circle"></i>  <span className="light">Start</span> Bootstrap
            </a>
        </div>

        {/*<!-- Collect the nav links, forms, and other content for toggling -->*/}
        <div className="collapse navbar-collapse navbar-right navbar-main-collapse">
            <ul className="nav navbar-nav">
                {/*<!-- Hidden li included to remove active class from about link when scrolled up past about section -->*/}
                <li className="hidden">
                    <a href="#page-top"></a>
                </li>
                <li>
                    <a className="page-scroll" href="#about">About</a>
                </li>
                <li>
                    <a className="page-scroll" href="#download">Download</a>
                </li>
                <li>
                    <a className="page-scroll" href="#contact">Contact</a>
                </li>
            </ul>
        </div>
        {/*<!-- /.navbar-collapse -->*/}
    </div>
    {/*<!-- /.container -->*/}
</nav>

{/*<!-- Intro Header -->*/}
<header className="intro">
    <div className="intro-body">
        <div className="container">
            <div className="row">
                <div className="col-md-8 col-md-offset-2">
                    <h1 className="brand-heading">Grayscale</h1>
                    <p className="intro-text">A free, responsive, one page Bootstrap theme.<br/>Created by Start Bootstrap.</p>
                    <a href="#about" className="btn btn-circle page-scroll">
                        <i className="fa fa-angle-double-down animated"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</header>

{/*<!-- About Section -->*/}
<section id="about" className="container content-section text-center">
    <div className="row">
        <div className="col-lg-8 col-lg-offset-2">
            <h2>About Grayscale</h2>
            <p>Grayscale is a free Bootstrap 3 theme created by Start Bootstrap. It can be yours right now, simply download the template on <a href="http://startbootstrap.com/template-overviews/grayscale/">the preview page</a>. The theme is open source, and you can use it for any purpose, personal or commercial.</p>
            <p>This theme features stock photos by <a href="http://gratisography.com/">Gratisography</a> along with a custom Google Maps skin courtesy of <a href="http://snazzymaps.com/">Snazzy Maps</a>.</p>
            <p>Grayscale includes full HTML, CSS, and custom JavaScript files along with LESS files for easy customization.</p>
        </div>
    </div>
</section>

{/*<!-- Download Section -->*/}
<section id="download" className="content-section text-center">
    <div className="download-section">
        <div className="container">
            <div className="col-lg-8 col-lg-offset-2">
                <h2>Download Grayscale</h2>
                <p>You can download Grayscale for free on the preview page at Start Bootstrap.</p>
                <a href="http://startbootstrap.com/template-overviews/grayscale/" className="btn btn-default btn-lg">Visit Download Page</a>
            </div>
        </div>
    </div>
</section>

{/*<!-- Contact Section -->*/}
<section id="contact" className="container content-section text-center">
    <div className="row">
        <div className="col-lg-8 col-lg-offset-2">
            <h2>Contact Start Bootstrap</h2>
            <p>Feel free to email us to provide some feedback on our templates, give us suggestions for new templates and themes, or to just say hello!</p>
            <p><a href="mailto:feedback@startbootstrap.com">feedback@startbootstrap.com</a>
            </p>
            <ul className="list-inline banner-social-buttons">
                <li>
                    <a href="https://twitter.com/SBootstrap" className="btn btn-default btn-lg"><i className="fa fa-twitter fa-fw"></i> <span className="network-name">Twitter</span></a>
                </li>
                <li>
                    <a href="https://github.com/IronSummitMedia/startbootstrap" className="btn btn-default btn-lg"><i className="fa fa-github fa-fw"></i> <span className="network-name">Github</span></a>
                </li>
                <li>
                    <a href="https://plus.google.com/+Startbootstrap/posts" className="btn btn-default btn-lg"><i className="fa fa-google-plus fa-fw"></i> <span className="network-name">Google+</span></a>
                </li>
            </ul>
        </div>
    </div>
</section>

{/*<!-- Map Section -->*/}
<div id="map"></div>

{/*<!-- Footer -->*/}
<footer>
    <div className="container text-center">
        <p>Copyright &copy; Your Website 2014</p>
    </div>
</footer>
</div>);
}

export default Landing;
