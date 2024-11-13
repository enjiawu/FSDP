const runTestRequest = async () => {
    try {
        const response = await fetch('http://localhost:3000/run-test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error executing test:', errorData);
            alert(`Test execution failed: ${errorData.message}`);
            return;
        }

        const result = await response.json().catch(() => ({ message: 'No response content' }));;
        console.log('Test executed successfully:', result);
        alert('Test executed successfully');
    } catch (error) {
        console.error('Network error:', error);
        alert('Network error occurred while executing test');
    }
};

const runSelectedTestRequest = async (testCases: string[]) => {
    try {
        const response = await fetch('http://localhost:3000/run-test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ testCases })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error executing test:', errorData);
            alert(`Test execution failed: ${errorData.message}`);
            return;
        }

        const result = await response.json().catch(() => ({ message: 'No response content' }));;
        console.log('Test executed successfully:', result);
        alert('Test executed successfully');
    } catch (error) {
        console.error('Network error:', error);
        alert('Network error occurred while executing test');
    }
};
export { runTestRequest, runSelectedTestRequest} ;
