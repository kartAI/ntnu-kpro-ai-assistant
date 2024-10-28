
export interface CaseData {
    caseNumber: number; // Use 'number' (primitive type), not 'Number' (object type)
    address: string;
    propertyUnit: number;
    farmUnit: number;
    receiveDate: Date | undefined;
    deadline: string;
}



export function getCase(casenumber: Number): CaseData | undefined {
    
    return cases.find(item => item.caseNumber === casenumber);
}

const cases: CaseData[] = [
    {
        caseNumber: 100239,
        address: "Søndre gate 5, 7011 Trondheim",
        propertyUnit: 142,
        farmUnit: 45,
        receiveDate: new Date('2024-08-20'),
        deadline: "2024-10-05"
    },
    {
        caseNumber: 100240,
        address: "Holbergs plass 3, 0166 Oslo",
        propertyUnit: 88,
        farmUnit: 12,
        receiveDate: new Date('2024-07-15'),
        deadline: "2024-09-01"
    },
    {
        caseNumber: 100241,
        address: "Stavangerveien 33, 4012 Stavanger",
        propertyUnit: 76,
        farmUnit: 23,
        receiveDate: new Date('2024-09-07'),
        deadline: "2024-10-20"
    },
    {
        caseNumber: 100242,
        address: "Nordre gate 20, 6002 Ålesund",
        propertyUnit: 54,
        farmUnit: 9,
        receiveDate: new Date('2024-06-10'),
        deadline: "2024-07-25"
    },
    {
        caseNumber: 100243,
        address: "Haugerudveien 18, 0674 Oslo",
        propertyUnit: 32,
        farmUnit: 4,
        receiveDate: new Date('2024-05-25'),
        deadline: "2024-07-10"
    }
];