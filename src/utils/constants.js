const PROVINCE_CHOICES = [
    {value: 'AB', label: 'Alberta'},
    {value: 'BC', label: 'British Columbia'},
    {value: 'MB', label: 'Manitoba'},
    {value: 'NB', label: 'New Brunswick'},
    {value: 'NL', label: 'Newfoundland and Labrador'},
    {value: 'NT', label: 'Northwest Territories'},
    {value: 'NS', label: 'Nova Scotia'},
    {value: 'NU', label: 'Nunavut'},
    {value: 'ON', label: 'Ontario'},
    {value: 'PE', label: 'Prince Edward Island'},
    {value: 'QC', label: 'Quebec'},
    {value: 'SK', label: 'Saskatchewan'},
    {value: 'YT', label: 'Yukon'},
]

const PROPERTY_TYPES = [
    {value: 'condo', label: 'Condominium'},
    {value: 'house', label: 'House'},
    {value: 'studio', label: 'Studio'},
    {value: 'townhouse', label: 'Town House'}
]

const AMENITY_CHOICES = [
    {value: 'bbq', label: 'BBQ'},
    {value: 'garden', label: 'Garden'},
    {value: 'gym', label: 'Gym'},
    {value: 'lounge', label: 'Lounge'},
    {value: 'parking', label: 'Parking'},
    {value: 'spa', label: 'Spa'},
    {value: 'wifi', label: 'Wi-Fi'}
];

const COMMON_CITIES = [
    {value: 'Toronto'},
    {value: 'Vancouver'},
    {value: 'Montreal'},
    {value: 'Calgary'},
    {value: 'Edmonton'},
    {value: 'Ottawa'},
    {value: 'Winnipeg'},
    {value: 'Quebec City'},
    {value: 'Hamilton'},
    {value: 'Kitchener'},
];

const EMAIL_SUFFIX = [
    '@gmail.com',
    '@yahoo.com',
    '@icloud.com',
    '@hotmail.com',
    '@outlook.com',
    '@live.com',
    'qq.com',
    '@163.com'
]
export const provinceChoices = (() => {
    return PROVINCE_CHOICES
});

export const propertyTypes = (() => {
    return PROPERTY_TYPES
})

export const amenityChoices = (() => {
    return AMENITY_CHOICES
})

export const commonCities = (() => {
    return COMMON_CITIES
})

export const commonEmail = (() => {
    return EMAIL_SUFFIX
})

export const createMappingObject = ((choices) => {
    const mapping = {};
    choices.forEach((choice) => {
        mapping[choice.value] = choice.label;
    });
    return mapping;
})

