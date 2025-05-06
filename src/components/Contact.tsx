import { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Contact = () => {
    const accordionData = [
        {
            title: 'Rifa personalizada',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            title: 'Fácil de usar',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            title: 'Administrable',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
            title: 'Proceso rápido',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
    ];

    const [expandedAccordion, setExpandedAccordion] = useState(0); // El primer acordeón está abierto por defecto

    const handleChange = (panel) => (event, isExpanded) => {
        setExpandedAccordion(isExpanded ? panel : false);
    };

    return (
        <div className="bg-gray-900 text-white py-24">
            <div className="container mx-auto px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-16">
                    <div className="md:w-1/2 flex justify-center">
                        <img src="/ticket.png" alt="Ticket" className="w-80 h-80 transform -rotate-12" />
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-5xl font-bold mb-12">Rifácil te brinda</h2>
                        <div className="">
                            {accordionData.map((item, index) => (
                                <Accordion
                                    key={index}
                                    expanded={expandedAccordion === index}
                                    onChange={handleChange(index)}
                                    className="bg-white bg-opacity-5 hover:bg-opacity-10 transition-all border-none mb-4"
                                    style={{ borderRadius: '24px' }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`panel-${index}-content`}
                                        id={`panel-${index}-header`}
                                        style={{
                                            borderTopLeftRadius: '24px',
                                            borderTopRightRadius: '24px',
                                            backgroundColor: expandedAccordion === index ? '#1c37a3' : 'inherit',
                                        }}
                                    >
                                        <Typography
                                            className="text-lg font-medium"
                                            style={{
                                                color: expandedAccordion === index ? 'white' : 'black',
                                            }}
                                        >
                                            {item.title}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails className="p-6">
                                        <Typography color="text.primary">
                                            {item.content}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;