import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Container } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            itemsPerPage: 2,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
        this.handlePageChange = this.handlePageChange.bind(this);
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData })
        )

        //console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        const { activePage, itemsPerPage, sortBy, filter } = this.state;

        var link = 'https://talentservicestalentlistingcompetition.azurewebsites.net/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
        // your ajax call and other logic goes here
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            data: {
                activePage,
                itemsPerPage,
                sortbyDate: sortBy.date,
                showActive: filter.showActive,
                showClosed: filter.showClosed,
                showDraft: filter.showDraft,
                showExpired: filter.showExpired,
                showUnexpired: filter.showUnexpired,
                limit: itemsPerPage
            },
            dataType: "json",
            success: function (response) {
                //console.log('API Response:', response);
                const totalPages = Math.ceil(response.totalCount / itemsPerPage);
                //console.log('totalPages:', totalPages);
                this.setState({
                    loadJobs: response.myJobs,
                    totalPages,
                }, callback);
            }.bind(this),
            error: function (error) {
                console.error('API Error:', error);
            }
        });
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    handlePageChange(element, data) {
        let newdata = JSON.parse(JSON.stringify(this.state));
        newdata['activePage'] = data.activePage;
        this.setState(newdata);
        this.loadNewData(newdata);
    };

    renderJobs() {
        const { loadJobs, activePage, itemsPerPage } = this.state;

        const startIndex = (activePage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        //console.log('startIndex:', startIndex, 'endIndex:', endIndex);

        const jobsForCurrentPage = loadJobs.slice(startIndex, endIndex);
        //console.log('loadJobs:', loadJobs);

        return <JobSummaryCard jobs={jobsForCurrentPage} />;
    }

    render() {
        return (
            <React.Fragment>
                <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>

                    <div className="ui container">
                        <h1>List Of Jobs</h1>

                        {/*Filter and Sort with no functionality*/}
                        <div className="ui container">
                            <Icon name='filter' />Filter:
                            <Dropdown text='Choose filter' inline dropdown />
                            <Icon name='calendar' />Sort by date:
                            <Dropdown text='Newest First' inline dropdown />
                        </div>

                        {/* Render the list of job cards */}
                        {this.renderJobs()}
                    </div>

                    <div className="talent-pagination">
                        <Container textAlign='center'>
                            <Pagination
                                activePage={this.state.activePage}
                                boundaryRange={0}
                                siblingRange={2}
                                totalPages={this.state.totalPages}
                                onPageChange={this.handlePageChange}
                            />
                        </Container>
                    </div>
                </BodyWrapper>
            </React.Fragment>
        );
    }
}