-- Update the profiles table to match signup form fields and profile page requirements

-- Add missing columns if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS business_type TEXT,
ADD COLUMN IF NOT EXISTS location TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS department TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS company_website TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS linkedin_profile TEXT DEFAULT '';

-- Make email field non-editable by removing update permissions
-- Create a policy that prevents email updates
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new update policy that excludes email field
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
    auth.uid() = user_id 
    AND email = (SELECT email FROM public.profiles WHERE user_id = auth.uid())
);

-- Update the trigger function to handle all signup form data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_partner_id TEXT;
BEGIN
    -- Generate a unique partner ID
    new_partner_id := public.generate_partner_id();
    
    -- Insert new profile with all metadata from signup
    INSERT INTO public.profiles (
        user_id, 
        partner_id, 
        full_name, 
        email,
        first_name,
        last_name,
        company_name,
        job_title,
        phone,
        country,
        business_type,
        location,
        bio,
        department,
        company_website,
        linkedin_profile
    )
    VALUES (
        NEW.id,
        new_partner_id,
        TRIM(COALESCE(NEW.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', '')),
        COALESCE(NEW.email, ''),
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'company_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'job_title', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'country', ''),
        COALESCE(NEW.raw_user_meta_data->>'business_type', ''),
        '', -- location - empty by default
        '', -- bio - empty by default  
        '', -- department - empty by default
        '', -- company_website - empty by default
        ''  -- linkedin_profile - empty by default
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail the user creation
        RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;