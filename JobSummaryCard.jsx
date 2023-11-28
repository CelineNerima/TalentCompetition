import React from 'react';
import Cookies from 'js-cookie';
import { Container, Pagination, Label, Card, Popup, Button, Icon } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this)
    }

    //Request to close a job
    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        var link = 'https://talentservicestalentlistingcompetition.azurewebsites.net/listing/listing/closeJob'

        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(id),
            dataType: "json",
            success: function (response) {
                console.log(response.message);
                window.location.reload(false);
                this.props.onJobClosed(id);
            }.bind(this),
            error: function (response) {
                console.log(response.message);
            }
        })
    }

    //Display the job summary cards
    renderJobCard(job, id) {
        return (
            <Card
                key={id}
                header={
                    <React.Fragment>
                        <Card.Header>{job.title}</Card.Header>
                        <Label as='a' color='black' ribbon='right'>
                            <Icon name="user" /> {job.noOfSuggestions}
                        </Label>
                    </React.Fragment>
                }
                meta={`${job.location.city}, ${job.location.country}`}
                description={job.summary}
                extra={
                    <React.Fragment>
                        <Button floated='left' size='mini' color='red'>Expired</Button>
                        <Button.Group floated='right' size='mini'>
                            <Button basic color='blue' onClick={() => this.selectJob(job.id)}><Icon name='ban' />Close</Button> {/*Close a job*/}
                            <Button basic color='blue' as='a' href={`/EditJob/${job.id}`}><Icon name='edit' />Edit</Button> {/*Update a job*/}
                            <Button basic color='blue'><Icon name='copy' />Copy</Button>
                        </Button.Group>
                    </React.Fragment>
                }
            />
        );
    }

    //Return to ManageJob.jsx
    render() {
        const { jobs } = this.props;

        return (
            <React.Fragment>
                <Container className="ui container">
                    {jobs.length > 0 ? (
                        <Card.Group itemsPerRow={2} doubling={true}>
                            {jobs.map((job, id) => this.renderJobCard(job, id))}
                        </Card.Group>
                    ) : (
                        <p>No Jobs Found</p>
                    )}
                </Container>
            </React.Fragment>
        );
    }
}