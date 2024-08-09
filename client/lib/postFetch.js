const postFetch = async (url, data) => {
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		const result = await response.json();
		return result;

	} catch (error) {
		console.error('Error in postFetch:', error);
		throw error;
	}
};

export default postFetch;